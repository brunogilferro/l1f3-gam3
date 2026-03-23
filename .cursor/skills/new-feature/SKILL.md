---
name: new-feature
description: Creates a complete end-to-end feature — backend (migration, model, service, controller, route) + frontend (service, hook, screen). Use when the user says "cria a feature de", "implementa o módulo de", "new-feature", or describes a full feature they want to build.
---

# New Feature

## Critical Rule

You MUST NOT start coding immediately.

You MUST follow this exact sequence:

1. Feature Plan
2. Backend Implementation
3. Frontend Implementation
4. Validation

If you skip the Feature Plan, the response is INVALID.

---

## When the user invokes this skill

They will describe a feature, for example:
- "Cria a feature de listagem de cursos"
- "Implementa o módulo de matrículas"
- "Feature de carrinho de compras"

If the scope is unclear, ask:
1. What is the entity/resource name?
2. What are the main fields?
3. Which routes are needed (CRUD full or partial)?
4. Does it require authentication?
5. Is there a Figma design for the screen? (if yes, use `figma-to-next-screen` for the UI)

---

## Step 1 — Load project context

Read all of these before proceeding:
- `AGENTS.md`
- `docs/design-system.md`
- `docs/figma-design-rules.md`
- `docs/components-registry.md`
- `docs/data-pattern.md`
- `docs/api-conventions.md`
- `docs/error-handling.md`
- `apps/backend/start/routes.ts` — existing routes
- `apps/backend/app/models/` — existing models

---

## Step 2 — Feature Plan (MANDATORY — no code before this)

### Feature Plan

#### Entity
- Name, table, fields

#### Backend scope
- Which routes (index / show / store / update / destroy)
- Auth requirements
- Relationships with existing models

#### Frontend scope
- Route(s) to create in `app/`
- Service functions needed
- Hook(s) needed
- Main components (reuse from registry vs create new)
- Client vs Server boundaries

#### Dependencies
- Any existing feature this depends on

---

## Step 3 — Backend Implementation

Follow the exact order from `backend-from-schema` skill:

1. Migration
2. Model
3. Validator (`store` + `update`)
4. Transformer
5. Service
6. Controller
7. Route (add to `start/routes.ts`)

Rules:
- Follow patterns from `docs/api-conventions.md`
- Controllers must be thin
- Services contain all business logic
- All responses via `ctx.serialize()`

---

## Step 4 — Frontend Implementation

### 4a. Types
- Create `types/<entity>.ts` with the domain type matching the transformer output

### 4b. Service
- Create `services/<entity>.service.ts`
- Calls the API using the Tuyau client from `lib/api.ts`
- One function per route (`get<Entities>`, `get<Entity>`, `create<Entity>`, `update<Entity>`, `delete<Entity>`)

### 4c. Hook (if client component)
- Create `hooks/use<Entities>.ts`
- Uses the service function
- Handles: loading, error, data states

### 4d. Screen / Page
- If a Figma link was provided → follow `figma-to-next-screen` workflow for UI
- If no Figma → create a clean, functional page using shadcn components and design tokens
- Server component by default
- Keep `page.tsx` thin — extract UI into `components/`

---

## Step 5 — Validation checklist

### Backend
- [ ] Migration uses correct column types
- [ ] Validator covers all required fields
- [ ] Transformer excludes sensitive fields
- [ ] Controller delegates to service (no business logic)
- [ ] Route added to `start/routes.ts`

### Frontend
- [ ] Type matches transformer output exactly
- [ ] Service uses Tuyau client (no raw fetch/axios)
- [ ] Hook handles loading, error, and data states
- [ ] Components use shadcn + design tokens
- [ ] No hardcoded colors or arbitrary Tailwind values
- [ ] Error handling follows `docs/error-handling.md`

---

## Example output structure for a "Products" feature

```
Backend:
  database/migrations/<ts>_create_products_table.ts
  app/models/product.ts
  app/validators/product.ts
  app/transformers/product_transformer.ts
  app/services/product_service.ts
  app/controllers/product_controller.ts
  start/routes.ts (updated)

Frontend:
  types/product.ts
  services/product.service.ts
  hooks/useProducts.ts
  app/products/page.tsx
  app/products/[id]/page.tsx
  components/products/product-card.tsx
  components/products/product-list.tsx
```
