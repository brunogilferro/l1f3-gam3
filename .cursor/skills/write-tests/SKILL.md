---
name: write-tests
description: Generates tests for backend (AdonisJS/Japa) or frontend (Vitest + Testing Library) following project conventions. Use when the user says "escreve testes para", "cria os testes de", "write-tests", or asks to test a specific file or feature.
---

# Write Tests

## When the user invokes this skill

They will provide either:
- A **file path** to test (e.g. `app/services/product_service.ts`)
- A **feature name** (e.g. "testes do módulo de produtos")
- A **type** of test (unit / integration / e2e)

If unclear, ask:
1. Backend or frontend?
2. Which file or feature?
3. Unit (isolated) or integration (with DB/API)?

---

## Step 1 — Load context

Read the target file and understand:
- What it does
- Its inputs and outputs
- Its dependencies (DB, services, external APIs)
- Edge cases and error paths

Also read:
- `AGENTS.md`
- `docs/api-conventions.md` (for backend integration tests)
- `docs/error-handling.md` (to test error scenarios)

---

## Backend Tests (AdonisJS + Japa)

### File location

```
apps/backend/tests/
  unit/
    <entity>_service.test.ts    ← unit tests for services
  functional/
    <entity>.test.ts             ← HTTP integration tests
```

### Unit test — Service

Tests the service in isolation (mock the model or DB).

```ts
// tests/unit/product_service.test.ts
import { test } from '@japa/runner'
import ProductService from '#services/product_service'

test.group('ProductService', () => {
  test('index returns all products', async ({ assert }) => {
    const service = new ProductService()
    const products = await service.index()
    assert.isArray(products)
  })

  test('store creates a product', async ({ assert }) => {
    const service = new ProductService()
    const product = await service.store({ name: 'Course A', price: 99 })
    assert.equal(product.name, 'Course A')
  })

  test('show throws when product not found', async ({ assert }) => {
    const service = new ProductService()
    await assert.rejects(() => service.show(9999))
  })
})
```

### Functional test — HTTP (integration)

Tests the full HTTP layer with a real in-memory database.

```ts
// tests/functional/products.test.ts
import { test } from '@japa/runner'

test.group('Products API', (group) => {
  group.each.setup(async () => {
    // seed test data if needed
  })

  test('GET /api/v1/products returns list', async ({ client }) => {
    const response = await client.get('/api/v1/products')
    response.assertStatus(200)
    response.assertBodyContains({ data: [] })
  })

  test('POST /api/v1/products creates product', async ({ client }) => {
    const response = await client.post('/api/v1/products').json({
      name: 'Course A',
      price: 99,
    })
    response.assertStatus(201)
    response.assertBodyContains({ data: { name: 'Course A' } })
  })

  test('POST /api/v1/products returns 422 for invalid data', async ({ client }) => {
    const response = await client.post('/api/v1/products').json({ name: '' })
    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'name' }] })
  })
})
```

### Auth in functional tests

```ts
// Authenticated request
const user = await UserFactory.create()
const response = await client
  .get('/api/v1/account/profile')
  .loginAs(user)

response.assertStatus(200)
```

### Rules for backend tests

- Test the happy path + at least one error case per endpoint
- Test validation errors (missing fields, wrong types)
- Test auth-protected routes with and without token
- Do NOT test framework internals (AdonisJS itself)
- Use `assert.containsSubset` for partial object matching

---

## Frontend Tests (Vitest + Testing Library)

### Setup required

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```

### File location

```
apps/frontend/
  __tests__/
    components/
      <component-name>.test.tsx
    hooks/
      use<Entity>.test.ts
```

### Component test

```tsx
// __tests__/components/product-card.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProductCard } from '@/components/products/product-card'

const mockProduct = { id: 1, name: 'Course A', price: 99 }

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Course A')).toBeInTheDocument()
  })

  it('renders price formatted', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/99/)).toBeInTheDocument()
  })
})
```

### Hook test (React Query)

Hooks that use React Query need a `QueryClientProvider` wrapper:

```ts
// __tests__/hooks/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { useProducts } from '@/hooks/useProducts'
import * as productService from '@/services/product.service'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useProducts', () => {
  it('loads products', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue([
      { id: 1, name: 'Course A', price: 99 },
    ])

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toHaveLength(1)
  })

  it('sets error on failure', async () => {
    vi.spyOn(productService, 'getProducts').mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeTruthy()
  })
})
```

### Rules for frontend tests

- Test behavior, not implementation (what the user sees, not how it's built)
- Test error and loading states, not just the happy path
- Mock services (never make real API calls in tests)
- Use `screen.getByRole` and `screen.getByText` over `getByTestId`
- Do NOT test shadcn internals — test your usage of them

---

## Test naming conventions

| Type | Pattern | Example |
|------|---------|---------|
| Backend unit | `<entity>_service.test.ts` | `product_service.test.ts` |
| Backend functional | `<entity>.test.ts` | `products.test.ts` |
| Frontend component | `<component>.test.tsx` | `product-card.test.tsx` |
| Frontend hook | `use<Entity>.test.ts` | `useProducts.test.ts` |

## Describe/it conventions

```ts
describe('<ComponentName or ServiceName>', () => {
  it('<verb> <expected behavior>', ...)
  // e.g. "renders product name"
  // e.g. "returns 422 for invalid input"
  // e.g. "sets error state on failure"
})
```
