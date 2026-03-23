---
name: review-file
description: Audits a file or set of files against project standards and outputs a structured report of issues. Use when the user says "revisa esse arquivo", "esse código segue o padrão?", "review-file", or asks for a quality check before merging/deploying.
---

# Review File

## When the user invokes this skill

They will point to a file or feature area, for example:
- "Revisa o `app/controllers/product_controller.ts`"
- "Dá uma olhada no módulo de courses antes de eu fazer o PR"
- "Esse hook está correto?"

If unclear, ask:
1. Which file(s) should be reviewed?
2. Is there a specific concern (performance, pattern, security, a11y)?

---

## Step 1 — Load context

Read the target file(s) and all applicable docs:

| File | Read when |
|------|-----------|
| `AGENTS.md` | Always |
| `docs/data-pattern.md` | Reviewing services, hooks, components |
| `docs/api-conventions.md` | Reviewing controllers, routes, services |
| `docs/error-handling.md` | Any file that handles errors |
| `docs/design-system.md` | Reviewing components, pages |
| `docs/figma-design-rules.md` | Reviewing components, pages (style tokens) |
| `docs/components-registry.md` | Reviewing components |
| `docs/state-management.md` | Reviewing hooks, context, stores |
| `.cursor/rules/accessibility.mdc` | Reviewing components, pages |

---

## Step 2 — Review

Read the file carefully. For each issue found, classify by severity:

| Level | Meaning |
|-------|---------|
| 🔴 Critical | Breaks the pattern in a way that will cause bugs or inconsistency across the codebase |
| 🟡 Warning | Deviates from convention but doesn't break anything right now |
| 🔵 Suggestion | Could be improved for clarity or future maintainability |

---

## Step 3 — Output the Review Report

Format the output as follows:

---

### Review: `<file-path>`

#### Summary
One sentence describing the overall state of the file.

#### Issues

**🔴 Critical**

- **[line X]** `fetch('/api/products')` called directly — should go through `services/product.service.ts` via Tuyau client.
- **[line Y]** Silent `catch` block — error is swallowed, user gets no feedback. See `docs/error-handling.md`.

**🟡 Warning**

- **[line X]** `"use client"` at page level — only the `<ProductForm>` sub-component needs it. Move there.
- **[line Y]** Hardcoded `#D4AF37` — replace with `var(--accent-primary)` from design tokens.

**🔵 Suggestion**

- **[line X]** Props interface defined inline — extract to a named interface above the component for readability.

#### Verdict

`✅ Approved` / `⚠️ Needs fixes before merging` / `🚫 Significant rework needed`

---

## Checklist used for review

### Backend files

- [ ] Controller is thin — delegates to service
- [ ] No business logic in controller
- [ ] Validator used for `store` and `update`
- [ ] Transformer used for all responses
- [ ] All responses via `ctx.serialize()`
- [ ] Auth middleware applied where required
- [ ] No sensitive fields exposed in transformer

### Frontend files — Components / Pages

- [ ] `"use client"` only where strictly necessary
- [ ] No API calls directly in component (goes through service)
- [ ] No hardcoded hex colors
- [ ] No arbitrary Tailwind values
- [ ] Props explicitly typed with interface
- [ ] Error states handled and shown to user
- [ ] Loading states handled
- [ ] Interactive states: hover, focus-visible, active, disabled

### Frontend files — Hooks

- [ ] Hook uses service function (not direct API call)
- [ ] `useQuery` / `useMutation` used (no manual `useState` + `useEffect` for async)
- [ ] Cache invalidated on mutation success
- [ ] Error surfaced (not swallowed)

### Frontend files — Services

- [ ] Uses Tuyau client from `lib/api.ts` (no raw `fetch` or `axios`)
- [ ] One function per route
- [ ] Returns typed data (matches transformer output)
- [ ] Throws error on API failure (so hook/component can handle it)

---

## After the report

If the file has Critical or Warning issues, offer to fix them:

```
Encontrei X issues críticos e Y warnings. Quer que eu aplique as correções agora? Use o skill `refactor` para isso.
```
