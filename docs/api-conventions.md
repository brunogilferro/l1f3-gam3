# API CONVENTIONS

## Core Principle

All API responses follow a consistent structure.
Never return raw data — always use `ctx.serialize()`.

---

## Response Structure

### Success (single object)

```json
{
  "data": {
    "id": 1,
    "name": "Bruno",
    "email": "bruno@example.com"
  }
}
```

### Success (list)

```json
{
  "data": [
    { "id": 1, "name": "Bruno" },
    { "id": 2, "name": "Ana" }
  ]
}
```

### Success (paginated)

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 5,
    "firstPage": 1
  }
}
```

### Success (action — no body)

```json
{
  "message": "Logged out successfully"
}
```

### Error

```json
{
  "errors": [
    {
      "message": "Email already in use",
      "field": "email",
      "rule": "unique"
    }
  ]
}
```

---

## HTTP Status Codes

| Situation | Status |
|-----------|--------|
| Successful GET | `200 OK` |
| Successful POST (created) | `201 Created` |
| Successful action (no body) | `200 OK` |
| Validation error | `422 Unprocessable Entity` |
| Unauthenticated | `401 Unauthorized` |
| Forbidden (no permission) | `403 Forbidden` |
| Resource not found | `404 Not Found` |
| Server error | `500 Internal Server Error` |

---

## URL Structure

- All routes under `/api/v1/`
- Resources are plural kebab-case: `/api/v1/access-tokens`, `/api/v1/new-account`
- Nested resources: `/api/v1/courses/:id/lessons`

---

## Controller Patterns

### index (list)
```ts
async index({ response, serialize }: HttpContext) {
  const items = await this.service.index()
  return serialize(items)
}
```

### show (single)
```ts
async show({ params, response, serialize }: HttpContext) {
  const item = await this.service.show(params.id)
  return serialize(item)
}
```

### store (create)
```ts
async store({ request, response, serialize }: HttpContext) {
  const data = await request.validateUsing(storeValidator)
  const item = await this.service.store(data)
  return response.created(serialize.withoutWrapping(item))
}
```

### update
```ts
async update({ params, request, serialize }: HttpContext) {
  const data = await request.validateUsing(updateValidator)
  const item = await this.service.update(params.id, data)
  return serialize(item)
}
```

### destroy (delete)
```ts
async destroy({ params }: HttpContext) {
  await this.service.destroy(params.id)
  return { message: 'Deleted successfully' }
}
```

---

## Validation Errors (AdonisJS / VineJS)

VineJS validation errors are automatically formatted by AdonisJS.
The default error structure is:

```json
{
  "errors": [
    {
      "message": "The email field must be a valid email address",
      "field": "email",
      "rule": "email"
    }
  ]
}
```

No custom error handling needed for validation — VineJS handles it.

---

## Pagination

Use Lucid's built-in paginator:

```ts
// Service
async index(page = 1, limit = 20) {
  return Product.query().paginate(page, limit)
}

// Controller
async index({ request, serialize }: HttpContext) {
  const page = request.input('page', 1)
  const limit = request.input('limit', 20)
  const products = await this.service.index(page, limit)
  return serialize(products)
}
```

---

## Rules

- NEVER return raw arrays or objects — always use `ctx.serialize()`
- NEVER expose sensitive fields (passwords, tokens, internal flags)
- ALWAYS use transformers to shape the response
- ALWAYS validate input with VineJS validators
- NEVER add business logic in controllers — delegate to services
