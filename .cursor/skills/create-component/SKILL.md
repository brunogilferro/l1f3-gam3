---
name: create-component
description: Creates a reusable UI component following project conventions (shadcn base, design tokens, TypeScript). Use when the user says "cria o componente", "cria um componente de", "create-component", or describes a UI piece they need without a Figma link and without a full feature.
---

# Create Component

## Critical Rule

You MUST NOT start coding immediately.

You MUST follow this exact sequence:

1. Component Plan
2. Implementation
3. Validation

If you skip the Component Plan, the response is INVALID.

---

## When the user invokes this skill

They will describe a UI piece, for example:
- "Cria um componente de avatar com fallback"
- "Preciso de um card de estatísticas com ícone, valor e label"
- "Cria um componente de empty state reutilizável"

If the description is unclear, ask:
1. What does this component display or do?
2. What props does it receive?
3. Does it have interactive states (hover, click, loading, disabled)?
4. Is it used in a specific context or is it generic/reusable?

---

## Step 1 — Load project context

Read these before proceeding:
- `docs/components-registry.md` — **check if the component already exists before creating**
- `docs/design-system.md` — spacing scale, typography, interaction states
- `docs/figma-design-rules.md` — color tokens and font variables to use

---

## Step 2 — Component Plan (MANDATORY — no code before this)

Output this section before any code:

### Component Plan

#### Name
- PascalCase, descriptive (e.g. `StatCard`, `EmptyState`, `UserAvatar`)

#### Location
- Generic/shared → `components/<component-name>.tsx`
- Feature-specific → `components/<feature>/<component-name>.tsx`

#### Props interface
| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| ... | ... | ... | ... | ... |

#### Composition
- Which shadcn components will be used as base
- Which design tokens will be used (colors, spacing, typography)
- Interactive states needed (hover, focus-visible, active, disabled, loading)

#### Client vs Server
- `"use client"` needed? (yes only if: event handlers, hooks, browser APIs)

---

## Step 3 — Implementation

After the Component Plan is fully written:

- Use TypeScript with explicit props interface
- Use shadcn components from `components/ui/` as the base where applicable
- Style using tokens from `figma-design-rules.md` — never hardcode hex values
- Use `lucide-react` for all icons
- Implement all relevant states: hover, focus-visible, active, disabled, loading
- Export as named export

### Component structure

```tsx
// components/stat-card.tsx
import { Card } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: 'up' | 'down'
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="...">
      ...
    </Card>
  )
}
```

### Rules

- Named export (not default)
- Props interface defined above the component
- No inline styles — Tailwind classes only
- No hardcoded colors or arbitrary Tailwind values
- If the component grows beyond ~80 lines, split into sub-components in the same file

---

## Step 4 — Validation checklist

- [ ] Component does NOT already exist in `docs/components-registry.md`
- [ ] Props interface is explicit and typed
- [ ] shadcn used as base where applicable
- [ ] Colors from design tokens (no hex, no hardcoded Tailwind colors)
- [ ] All relevant states implemented (hover, focus, disabled, loading)
- [ ] Named export
- [ ] No `"use client"` unless strictly necessary

---

## Step 5 — Registry update

After creating the component, add it to `docs/components-registry.md`:

```md
### <ComponentName>
- **File**: `components/<component-name>.tsx`
- **Props**: `label`, `value`, `icon`, ...
- **Use when**: ...
- **Do NOT use when**: ...
```

This ensures future generations reuse the component instead of recreating it.
