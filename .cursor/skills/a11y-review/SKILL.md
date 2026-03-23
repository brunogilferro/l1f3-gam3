---
name: a11y-review
description: Audits and fixes accessibility issues in a component or page following the project's accessibility rules. Use when the user says "verifica acessibilidade", "esse componente está acessível?", "a11y-review", or asks to fix a11y issues in a specific file.
---

# A11y Review

## When the user invokes this skill

They will point to a component or page, for example:
- "Verifica a acessibilidade do `components/product-form.tsx`"
- "Esse modal está acessível?"
- "a11y-review na tela de login"

If unclear, ask:
1. Which file(s) or screen should be reviewed?
2. Fix issues automatically, or just report them?

---

## Step 1 — Load context

Read before proceeding:
- The target file(s)
- `.cursor/rules/accessibility.mdc` — the full a11y ruleset for this project

---

## Step 2 — Audit

Read the file carefully. Check every rule from `.cursor/rules/accessibility.mdc`.

Classify each issue by impact:

| Level | Meaning |
|-------|---------|
| 🔴 Critical | Blocks keyboard users or screen readers entirely |
| 🟡 Warning | Fails WCAG AA in specific contexts |
| 🔵 Suggestion | Best practice not followed, low impact |

---

## Step 3 — Output the A11y Report

---

### A11y Review: `<file-path>`

#### Issues

**🔴 Critical**

- **[line X]** Icon-only `<Button>` has no `aria-label` — screen reader users have no idea what it does.
- **[line Y]** `<Input id="email">` has no associated `<Label>` — the field is unlabeled for assistive technology.

**🟡 Warning**

- **[line X]** Error message `<p>Invalid email</p>` is not linked to the input via `aria-describedby` — screen readers won't associate it.
- **[line Y]** Submit button doesn't have `disabled` or `aria-busy` during loading — screen reader announces it as still active.

**🔵 Suggestion**

- **[line X]** `<div onClick={...}>` used for a clickable element — replace with `<button>` for keyboard + screen reader support.
- **[line Y]** `<img>` without `alt` attribute — add descriptive alt or `alt=""` if decorative.

#### Verdict

`✅ Accessible` / `⚠️ Minor issues` / `🚫 Accessibility failures — needs fixes`

---

## Step 4 — Fix (if requested)

If the user asks to fix, apply all Critical and Warning issues. Do not change visual design.

### Common fixes

**Missing label on input**
```tsx
// Before
<Input id="email" type="email" />

// After
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-required="true" />
```

**Error not linked to input**
```tsx
// Before
<Input id="email" />
{error && <p className="text-destructive">{error}</p>}

// After
<Input
  id="email"
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <p id="email-error" role="alert" className="text-destructive text-sm mt-1">
    {error}
  </p>
)}
```

**Icon-only button missing aria-label**
```tsx
// Before
<Button variant="ghost" size="icon">
  <Trash2 size={16} />
</Button>

// After
<Button variant="ghost" size="icon" aria-label="Delete item">
  <Trash2 size={16} />
</Button>
```

**Loading button not communicating state**
```tsx
// Before
<Button onClick={handleSubmit}>Save</Button>

// After
<Button onClick={handleSubmit} disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

**Div used as interactive element**
```tsx
// Before
<div onClick={handleClick} className="cursor-pointer">Click me</div>

// After
<button onClick={handleClick} className="cursor-pointer">Click me</button>
```

**Focus ring removed**
```tsx
// Before
className="outline-none"

// After
className="focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:outline-none"
```

---

## Checklist used for review

- [ ] All inputs have visible `<Label>` with matching `htmlFor`/`id`
- [ ] Error messages linked via `aria-describedby`
- [ ] Required fields have `aria-required="true"` or `required`
- [ ] Icon-only buttons have `aria-label`
- [ ] Loading buttons have `disabled` + `aria-busy`
- [ ] All images have `alt` (descriptive or `""` if decorative)
- [ ] Page has `<main>` wrapping primary content
- [ ] Semantic HTML used (no `<div>` for buttons, nav, etc.)
- [ ] Focus rings visible — no global `outline-none`
- [ ] Modals trap focus (shadcn Dialog handles this automatically)
- [ ] Dynamic errors use `role="alert"` or `aria-live`
- [ ] Information not conveyed by color alone
