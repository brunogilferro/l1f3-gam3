---
name: figma-to-next-screen
description: Implements a screen from Figma as a Next.js App Router page using shadcn/ui and project design tokens. Use when the user provides a Figma link or asks to implement the current Figma selection, or mentions "tela do Figma", "implementar design", "figma to next".
---

# Figma to Next.js Screen

## Critical Rule

You MUST NOT start coding immediately.

You MUST follow this exact sequence:

1. Architecture Plan
2. Implementation
3. Refinement

If you skip the Architecture Plan, the response is INVALID.

---

## Step 1 — Resolve design source

- If a Figma link was provided: use it directly
- If the user said "minha seleção" / "current selection": use Figma MCP to get the active node
- Extract `node-id` from URLs: `?node-id=3-72` → `3:72`

---

## Step 2 — Load Figma context

1. Call `get_design_context` for the target node
2. Call `get_screenshot` and keep it as visual reference throughout

---

## Step 3 — Load project context

Read ALL of these before proceeding:

- `AGENTS.md` — project structure, rules, and architecture
- `docs/design-system.md` — spacing, typography scale, layout rules
- `docs/figma-design-rules.md` — project colors, fonts, and CSS tokens (CRITICAL — use these, never hardcode)
- `docs/components-registry.md` — available shadcn components and custom components
- `docs/data-pattern.md` — data flow rules

---

## Step 4 — Architecture Plan (MANDATORY — no code before this)

Output this section before any code:

### Architecture Plan

#### Sections
- List the logical UI sections of the screen

#### Components
- Which shadcn components will be used (Button, Input, Card, etc.)
- Which components can be reused from the registry
- Which new components need to be created (and why)

#### Client vs Server
- What requires `"use client"` (forms, interactivity, browser APIs)
- What stays as server component

#### Route
- Where the page file will be created (e.g. `app/dashboard/page.tsx`)

---

## Step 5 — Implementation

After the Architecture Plan is fully written:

- Use Next.js App Router, React 19, TypeScript, Tailwind v4
- Server component by default — `"use client"` only when required
- Keep `page.tsx` thin — extract UI into `components/`
- Use shadcn components from `components/ui/` as the base
- Style using tokens from `figma-design-rules.md` — never hardcode hex values
- Use `lucide-react` for all icons
- Implement all interaction states: hover, focus-visible, active, disabled, transition

### Component structure

- Extract named components for clear UI sections (form, card, header, etc.)
- Place under `components/` or `components/<feature>/`
- The page file only composes layout and imports components

---

## Step 6 — Refinement

After generating code:

1. Compare implementation with the Figma screenshot
2. Check: spacing, font sizes, alignment, visual hierarchy
3. Fix: replace arbitrary values with design system tokens
4. Check: all interactive elements have hover + focus-visible states
5. If Next.js dev server is running → call `get_errors` via Next.js MCP and fix any issues

---

## Checklist before finishing

- [ ] Architecture Plan was completed before any code
- [ ] All shadcn components used where applicable
- [ ] Colors use tokens from `figma-design-rules.md` (no hardcoded hex)
- [ ] Page file is thin — UI is extracted into components
- [ ] Hover, focus-visible, active states implemented
- [ ] Implementation compared against Figma screenshot
- [ ] No arbitrary Tailwind values used
