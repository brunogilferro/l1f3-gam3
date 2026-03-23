# ERROR HANDLING

## Core Principle

Errors must be handled consistently across the entire application.
The user must always receive clear, actionable feedback.
Never let errors fail silently.

---

## Backend

### Where errors are handled

AdonisJS handles most errors automatically via `app/exceptions/handler.ts`.

For custom error types, throw AdonisJS built-in exceptions:

```ts
import { errors } from '@adonisjs/core'
import { errors as authErrors } from '@adonisjs/auth'

// Not found
throw new errors.E_ROW_NOT_FOUND()

// Unauthorized
throw new authErrors.E_UNAUTHORIZED_ACCESS('Invalid credentials', {
  guardDriverName: 'access_tokens',
})

// Custom business logic error
import { Exception } from '@adonisjs/core/exceptions'

throw new Exception('Course is already full', {
  status: 422,
  code: 'E_COURSE_FULL',
})
```

### Error response format

All errors return:

```json
{
  "errors": [
    {
      "message": "Human readable message",
      "field": "fieldName",   // only for validation errors
      "rule": "ruleName",     // only for validation errors
      "code": "E_CUSTOM"      // only for custom exceptions
    }
  ]
}
```

### Rules

- NEVER return 200 with an error body
- NEVER expose stack traces in production
- ALWAYS use appropriate HTTP status codes (see `api-conventions.md`)
- Use `E_ROW_NOT_FOUND` for missing records (auto-returns 404)
- Use `422` for business rule violations
- Use `401` for auth failures — never `403` unless the user is authenticated but lacks permission

---

## Frontend

### Where errors are shown

| Error type | Where it appears |
|------------|-----------------|
| Form field validation | Inline below the field |
| Form submission error (e.g. email in use) | Alert at the top of the form |
| Page-level error (e.g. resource not found) | Full error state in the page |
| Background action (e.g. delete) | Toast notification |
| Network/server error (500) | Toast notification |

### Error handling in hooks

Use React Query — it handles loading, error, and data states automatically:

```ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}

// In the component:
const { data, isLoading, error } = useProducts()
```

For mutations, handle errors in `onError`:

```ts
export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    onError: (error) => {
      // error is the thrown value from the service
      console.error(parseApiError(error))
    },
  })
}
```
```

### Parsing API errors

Use a shared utility to parse error responses:

```ts
// lib/parse-error.ts
export function parseApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'errors' in error) {
    const apiError = error as { errors: { message: string }[] }
    return apiError.errors?.[0]?.message ?? 'An error occurred'
  }
  return 'An unexpected error occurred'
}
```

### Form validation errors (field-level)

```ts
// After a failed form submission
if (error.errors) {
  error.errors.forEach(({ field, message }) => {
    form.setError(field, { message })
  })
}
```

### Loading and error states in UI

Always show feedback:

```tsx
if (isLoading) return <Skeleton className="h-40 w-full" />

if (error) return (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)

if (!data.length) return <EmptyState message="No items found." />
```

### shadcn components to use

| Situation | Component |
|-----------|-----------|
| Field error | `<p className="text-destructive text-sm mt-1">{error}</p>` |
| Form-level error | `<Alert variant="destructive">` |
| Page-level error | Custom `ErrorState` component |
| Toast (success/error) | `sonner` (add via `npx shadcn@latest add sonner`) |

---

## Anti-patterns (FORBIDDEN)

- ❌ `catch (e) {}` — silent errors
- ❌ `console.error` as the only error handling
- ❌ Showing raw error objects to the user
- ❌ Generic "Something went wrong" without any context
- ❌ Not handling the loading state (causes layout shift)
- ❌ Returning 200 with `{ success: false }` from the API
