# COMPONENT REGISTRY

## Core Principle

**Always use shadcn/ui as the base.**

Before creating any component, check if shadcn already provides it.
If it does → install it and customize. If it doesn't → build on top of existing shadcn primitives.

Never create from scratch what shadcn already solves.

---

## Component Priority Order

```
1. shadcn/ui component exists?    → use it, customize via tokens
2. Can compose from shadcn parts? → compose it
3. Nothing fits?                  → create generic component in components/
```

---

## shadcn Components in Use

Components are installed via CLI (`npx shadcn@latest add <component>`) and live in `components/ui/`.

| Component      | shadcn source    | Usage                                   |
|----------------|------------------|-----------------------------------------|
| `Button`       | `button`         | All button variants                     |
| `Input`        | `input`          | Text inputs                             |
| `Textarea`     | `textarea`       | Multi-line text                         |
| `Select`       | `select`         | Dropdown selects                        |
| `Card`         | `card`           | Content containers                      |
| `Badge`        | `badge`          | Status indicators                       |
| `Alert`        | `alert`          | Feedback messages (error, warning, etc) |
| `Dialog`       | `dialog`         | Modals                                  |
| `Sheet`        | `sheet`          | Side panels / drawers                   |
| `Separator`    | `separator`      | Visual dividers                         |
| `Skeleton`     | `skeleton`       | Loading placeholders                    |
| `Tooltip`      | `tooltip`        | Contextual hints                        |
| `DropdownMenu` | `dropdown-menu`  | Action menus                            |
| `Form`         | `form`           | Form with validation (react-hook-form)  |
| `Label`        | `label`          | Form labels                             |

> Add new entries here as components are installed.

---

## Customization Rules

shadcn components MUST be styled using the project's design tokens, not default shadcn colors.

The mapping happens in `globals.css` via CSS variables:

```css
/* shadcn uses these variable names — map them to your design tokens */
:root {
  --background: var(--bg-primary);
  --foreground: var(--text-primary);
  --card: var(--bg-surface);
  --card-foreground: var(--text-primary);
  --border: var(--border-primary);
  --input: var(--border-primary);
  --primary: var(--accent-primary);
  --primary-foreground: var(--bg-primary);
  --muted: var(--bg-secondary);
  --muted-foreground: var(--text-secondary);
  --ring: var(--accent-primary);
}
```

**Rules:**
- Never override component styles inline
- Never hardcode colors inside component files
- Customize by adjusting CSS variables in `globals.css`
- Use `className` for layout/spacing overrides only (e.g. `className="w-full mt-4"`)

---

## Custom Components (built on top of shadcn)

When a project-specific component is needed that doesn't exist in shadcn:

| Component    | Built with               | Location                |
|--------------|--------------------------|-------------------------|
| `EmptyState` | `Card` + lucide icon     | `components/empty-state.tsx` |
| `PageContainer` | `div` + layout tokens | `components/page-container.tsx` |

> Add here as components are created.

---

## Adding a New Component

1. Check if shadcn has it → `npx shadcn@latest add <name>`
2. If not → check if it can be composed from existing shadcn components
3. If building custom:
   - Must be generic (not page-specific)
   - Must live in `components/`
   - Must have typed props
   - Must use design tokens (no hardcoded values)

---

## Naming Conventions

- Use PascalCase for all component names
- shadcn components stay as installed (e.g. `Button`, `Card`)
- Custom components follow descriptive naming (e.g. `EmptyState`, `PageContainer`)

---

## Anti-patterns (FORBIDDEN)

- ❌ Recreating a component that shadcn already provides
- ❌ Overriding shadcn styles with hardcoded colors
- ❌ Creating page-specific components inside `app/`
- ❌ Using shadcn internals — always import from `components/ui/`
- ❌ Mixing shadcn with another component library (Radix direct, MUI, etc.)
