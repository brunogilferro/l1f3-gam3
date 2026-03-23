# DATA PATTERN

## Core Principle

Data access must be separated from UI.

Components must never handle API logic directly.

---

## Data Flow

```
Component → Hook (React Query) → Service → API (Tuyau client)
```

---

## Structure

### Services (API layer)

- Location: `services/`
- Responsibility:
  - Handle API calls via `lib/api.ts` (Tuyau client)
  - Transform raw responses if needed
  - No UI logic, no state

Naming: `<entity>.service.ts` → e.g. `product.service.ts`

---

### Hooks (Data layer)

- Location: `hooks/`
- Built with **React Query** (`useQuery`, `useMutation`)
- Responsibility:
  - Call services via React Query
  - Expose `data`, `isLoading`, `error` to components
  - Handle cache, refetch, and stale state automatically

Naming: `use<EntityPlural>.ts` → e.g. `useProducts.ts`

---

### Types (Domain layer)

- Location: `types/`
- Responsibility:
  - Define domain models
  - Define API response shapes

Naming: `<entity>.ts` → e.g. `product.ts`

---

## Rules

- NEVER call APIs directly inside components
- ALWAYS use services for API communication
- ALWAYS use React Query hooks for data fetching (not manual useState)
- Services MUST be pure functions (no side effects outside API calls)
- Mutations (create/update/delete) MUST use `useMutation`
- After a mutation, invalidate the relevant query cache

---

## Server Components Exception

In server components:
- You MAY call services directly (no hooks needed)
- DO NOT use React Query hooks (they are client-only)

---

## Query Keys Convention

Use consistent, predictable query keys:

```ts
['products']              // all products
['products', id]          // single product
['products', { page }]    // paginated products
['users', 'profile']      // nested resource
```

---

## Example Flow

```ts
// types/product.ts
export type Product = {
  id: number
  name: string
  price: number
}

// services/product.service.ts
import { api } from '@/lib/api'

export async function getProducts(): Promise<Product[]> {
  const response = await api.products.$get()
  return response.json().then((r) => r.data)
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const response = await api.products.$post({ json: data })
  return response.json().then((r) => r.data)
}

// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, createProduct } from '@/services/product.service'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// component (client)
const { data, isLoading, error } = useProducts()
const { mutate: create, isPending } = useCreateProduct()

// component (server)
const products = await getProducts()
```

---

## Anti-patterns (FORBIDDEN)

- ❌ `fetch`/`axios` inside components
- ❌ Manual `useState` + `useEffect` for data fetching (use React Query)
- ❌ Business logic inside UI components
- ❌ Duplicating API calls across components
- ❌ Calling services without hooks in client components
- ❌ Mutations that don't invalidate related queries
