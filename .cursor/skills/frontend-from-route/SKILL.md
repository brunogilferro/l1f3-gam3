---
name: frontend-from-route
description: Generates the frontend layer (types, service, hook, page) for an existing backend route, using the Tuyau client. Use when the user says "conecta o frontend ao backend de", "cria o frontend para a rota", "frontend-from-route", or when a backend resource exists but the frontend side is missing.
---

# Frontend from Route

## Critical Rule

You MUST NOT start coding immediately.

You MUST follow this exact sequence:

1. Route Inspection
2. Frontend Plan
3. Implementation
4. Validation

If you skip the Frontend Plan, the response is INVALID.

---

## When the user invokes this skill

They will reference an existing backend route, for example:
- "Conecta o frontend à rota de products"
- "Cria o frontend para /api/v1/courses"
- "O backend de enrollments já existe, cria o frontend"

If unclear, ask:
1. What is the resource name?
2. Which routes exist (index / show / store / update / destroy)?
3. Does the screen need a Figma design? (if yes, use `figma-to-next-screen` for the UI)
4. Is auth required to access the routes?

---

## Step 1 — Load project context

Read these before proceeding:
- `AGENTS.md` — project structure and architecture rules
- `docs/data-pattern.md` — Component → Hook → Service → API flow
- `docs/api-conventions.md` — response format `{ data: ... }`
- `docs/error-handling.md` — how to handle and display errors
- `docs/components-registry.md` — available components to reuse
- `apps/backend/start/routes.ts` — confirm the routes exist and their paths
- `apps/backend/app/transformers/` — read the transformer to know the exact response shape

> **Important**: The Tuyau client at `lib/api.ts` is auto-generated from the backend routes.
> Make sure the backend is running (`pnpm dev:backend`) so Tuyau types are up to date before implementing.

---

## Step 2 — Frontend Plan (MANDATORY — no code before this)

Output this section before any code:

### Frontend Plan

#### Resource
- Name (singular): e.g. `Product`
- API prefix: e.g. `/api/v1/products`

#### Routes confirmed
| Method | Path | Action |
|--------|------|--------|
| GET | /api/v1/products | list |
| GET | /api/v1/products/:id | detail |
| POST | /api/v1/products | create |
| ... | ... | ... |

#### Response shape (from transformer)
```ts
// What the API returns per item
{
  id: number
  name: string
  ...
}
```

#### Files to create
| File | Purpose |
|------|---------|
| `types/<entity>.ts` | Domain type |
| `services/<entity>.service.ts` | API calls via Tuyau |
| `hooks/use<Entities>.ts` | Data hook (if client component) |
| `app/<entities>/page.tsx` | List page |
| `app/<entities>/[id]/page.tsx` | Detail page (if needed) |
| `components/<entity>-list.tsx` | List component (if needed) |

---

## Step 3 — Implementation

Generate files in this exact order:

### 1. Types (`types/<entity>.ts`)

Match the transformer output exactly — no extra fields, no missing fields.

```ts
// types/product.ts
export interface Product {
  id: number
  name: string
  price: number
  createdAt: string
  updatedAt: string
}
```

### 2. Service (`services/<entity>.service.ts`)

Uses the Tuyau client from `lib/api.ts`. One function per route.

```ts
// services/product.service.ts
import { api } from '@/lib/api'
import type { Product } from '@/types/product'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await api.products.$get()
  if (error) throw error
  return data.data
}

export async function getProduct(id: number): Promise<Product> {
  const { data, error } = await api.products[':id'].$get({ params: { id } })
  if (error) throw error
  return data.data
}

export async function createProduct(payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await api.products.$post({ body: payload })
  if (error) throw error
  return data.data
}
```

### 3. Hook (`hooks/use<Entities>.ts`) — only for client components

Uses the service function with React Query.

```ts
// hooks/useProducts.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, createProduct } from '@/services/product.service'
import { parseError } from '@/lib/parse-error'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    onError: (err) => console.error(parseError(err)),
  })
}
```

### 4. Page (`app/<entities>/page.tsx`)

Server component by default. Keep it thin — extract UI into `components/`.

```tsx
// app/products/page.tsx
import { getProducts } from '@/services/product.service'
import { ProductList } from '@/components/products/product-list'

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <main>
      <ProductList products={products} />
    </main>
  )
}
```

---

## Rules

- Always use Tuyau client (`lib/api.ts`) — never raw `fetch` or `axios`
- Types must match transformer output exactly
- Server components call services directly (no hooks)
- Client components use hooks
- Error handling follows `docs/error-handling.md` — never silent errors
- No hardcoded colors or arbitrary Tailwind values

---

## Step 4 — Validation checklist

- [ ] Types match the transformer output exactly
- [ ] Service uses Tuyau client (no raw fetch/axios)
- [ ] Hook handles loading, error, and data states
- [ ] `useQuery` invalidates cache on mutation success
- [ ] Page is a Server Component by default
- [ ] Error handling follows `docs/error-handling.md`
- [ ] No hardcoded colors or arbitrary Tailwind values

---

## Step 5 — If a Figma design exists

If the user has a Figma design for this screen, run `figma-to-next-screen` after this skill to implement the UI layer on top of the service/hook just created:

```
figma-to-next-screen: [Figma link]
```

The service and hook are already wired — `figma-to-next-screen` will only need to implement the visual layer.
