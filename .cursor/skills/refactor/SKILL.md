---
name: refactor
description: Refactors existing code to align with project conventions (data flow, naming, error handling, design tokens, component structure). Use when the user says "refatora", "ajusta esse código para o padrão", "refactor", or points to a file that's drifting from project standards.
---

# Refactor

## Critical Rule

You MUST NOT start changing code immediately.

You MUST follow this exact sequence:

1. Audit
2. Refactor Plan
3. Implementation
4. Validation

If you skip the Refactor Plan, the response is INVALID.

---

## When the user invokes this skill

They will point to a file or describe what needs to be fixed, for example:
- "Refatora o `services/course.service.ts`"
- "Esse componente não segue o padrão, arruma"
- "Tem uns hardcoded aqui que precisam virar tokens"

If unclear, ask:
1. Which file(s) should be refactored?
2. Is there a specific problem area (data flow, styles, error handling, naming)?

---

## Step 1 — Load context

Read the target file(s) and all relevant docs:

- `AGENTS.md` — architecture rules
- `docs/data-pattern.md` — Component → Hook → Service → API flow
- `docs/error-handling.md` — error handling conventions
- `docs/design-system.md` — spacing, typography
- `docs/figma-design-rules.md` — color tokens (if the file has styles)
- `docs/components-registry.md` — if the file is a component

---

## Step 2 — Audit

Read the target file carefully. Identify every deviation from project standards.

Categorize issues by type:

### Architecture issues
- Business logic in component instead of service
- HTTP logic in service (should be in controller)
- Hook calling API directly instead of via service
- Missing type for API response

### Naming issues
- Files not following `snake_case` (backend) or `kebab-case` (frontend)
- Functions not following conventions from `docs/data-pattern.md`

### Style issues
- Hardcoded hex colors (should be CSS tokens)
- Arbitrary Tailwind values (`w-[347px]`, `text-[13px]`)
- Inline styles

### Error handling issues
- Silent errors (`catch` with empty body or `console.log` only)
- Error not shown to user
- Not following `docs/error-handling.md`

### Other
- Missing TypeScript types
- `"use client"` where not needed
- Props not typed with an interface

---

## Step 3 — Refactor Plan (MANDATORY — no code before this)

Output this section before any code:

### Refactor Plan

#### File: `<path>`

| Issue | Type | Fix |
|-------|------|-----|
| `fetch('/api/products')` called directly in component | Architecture | Move to `services/product.service.ts` |
| `color: '#D4AF37'` hardcoded | Style | Replace with `var(--accent-primary)` |
| `catch (e) {}` silently swallows error | Error handling | Surface error via `parseError` |
| ... | ... | ... |

**Scope**: List which files will be touched.

---

## Step 4 — Implementation

Apply all fixes from the Refactor Plan.

### Rules

- Change only what the plan identifies — do NOT add unrelated improvements
- Preserve existing logic and behavior — this is a standards alignment, not a rewrite
- If a fix requires creating a new file (e.g. moving logic to a service), create the minimal necessary file
- Do not add comments explaining the refactor — the code should be self-evident

### Common fixes

**Move API call to service**
```ts
// Before (in component/hook)
const res = await fetch('/api/v1/products')
const { data } = await res.json()

// After (in services/product.service.ts)
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await api.products.$get()
  if (error) throw error
  return data.data
}
```

**Replace hardcoded color with token**
```tsx
// Before
<div className="text-[#D4AF37]">

// After
<div className="text-[var(--accent-primary)]">
```

**Fix silent error**
```ts
// Before
try {
  await doSomething()
} catch (e) {}

// After
try {
  await doSomething()
} catch (err) {
  toast.error(parseError(err))
}
```

**Remove unnecessary `"use client"`**
```tsx
// Before — "use client" only because of a single onClick
'use client'
export default function Page() { ... }

// After — extract interactive part to a sub-component
// page.tsx → Server Component
// components/page-actions.tsx → "use client"
```

---

## Step 5 — Validation checklist

- [ ] No business logic in components
- [ ] All API calls go through service → Tuyau client
- [ ] All errors surface to the user (no silent catch)
- [ ] No hardcoded hex colors
- [ ] No arbitrary Tailwind values
- [ ] TypeScript types present on all props and function returns
- [ ] `"use client"` only where strictly necessary
- [ ] Naming follows project conventions
- [ ] Behavior is unchanged — only structure/standards were fixed
