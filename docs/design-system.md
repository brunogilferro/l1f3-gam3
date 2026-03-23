# DESIGN SYSTEM

> This file defines structural rules — spacing, layout, typography scale, interaction patterns.
> It does NOT define colors, font families, or any project-specific visual identity.
> Those are defined in `docs/figma-design-rules.md`.

---

## Core Principles

- Always use predefined tokens
- Never use arbitrary values
- Prefer consistency over pixel perfection
- Reuse patterns before creating new ones

---

## Spacing Scale (Tailwind only)

| Token | Value | Classes         |
|-------|-------|-----------------|
| xs    | 4px   | p-1 / m-1       |
| sm    | 8px   | p-2 / m-2       |
| md    | 12px  | p-3 / m-3       |
| lg    | 16px  | p-4 / m-4       |
| xl    | 24px  | p-6 / m-6       |
| 2xl   | 32px  | p-8 / m-8       |

RULES:
- Never use arbitrary spacing values (e.g. `mt-[18px]`)
- Always snap to nearest scale value

---

## Border Radius

| Token | Class       |
|-------|-------------|
| sm    | rounded-md  |
| md    | rounded-lg  |
| lg    | rounded-xl  |
| xl    | rounded-2xl |

---

## Typography

### Font Families

Font families are defined per project in `docs/figma-design-rules.md`.
Use CSS variables: `--font-heading` and `--font-body`.

### Font Sizes (STRICT SCALE)

| Token | Class           | Size  |
|-------|-----------------|-------|
| xs    | text-[11px]     | 11px  |
| sm    | text-xs         | 12px  |
| base  | text-sm         | 14px  |
| md    | text-base       | 16px  |
| lg    | text-lg         | 18px  |
| xl    | text-[22px]     | 22px  |
| 2xl   | text-[28px]     | 28px  |

RULES:
- Do NOT introduce new font sizes outside this scale
- Font weights follow project definition in `figma-design-rules.md`

---

## Colors

Colors are defined per project in `docs/figma-design-rules.md` as CSS variables.

RULES:
- Never hardcode hex values inside components
- Always use tokens (CSS variables or Tailwind config)
- Tokens must follow the naming defined in `figma-design-rules.md`

---

## Layout Rules

- Container max width: `max-w-7xl`
- Default padding: `px-6 py-4`
- Section spacing: `space-y-6`
- Grid gaps: `gap-4` or `gap-6`
- Card padding: `p-4` or `p-6`

RULES:
- Do not invent new layout patterns
- Keep consistent spacing across pages

---

## Interaction

All interactive elements MUST have:

- hover state
- focus-visible state
- active state (when relevant)
- disabled state (when relevant)
- transition (`duration-150` or `duration-200`)

---

## Motion

- Use `motion/react` for animations
- Keep animations subtle and fast
- Prefer opacity and transform transitions

---

## Shadows

| Token | Class     |
|-------|-----------|
| sm    | shadow-sm |
| md    | shadow-md |
| lg    | shadow-lg |

---

## Icon Rules

- Default icon size: 16px or 20px
- Use `lucide-react` exclusively
- Do not mix icon libraries

---

## Component Consistency

- Cards must always use:
  - `p-4` or `p-6`
  - `rounded-lg` or higher
  - `shadow-sm` or `shadow-md`

- Buttons must:
  - have consistent height
  - include all interaction states

---

## Validation Checklist

Before finishing any UI:

- [ ] Spacing uses defined scale (no arbitrary values)
- [ ] Typography uses defined size scale
- [ ] Colors use tokens from `figma-design-rules.md`
- [ ] All interactive elements have proper states
- [ ] No hardcoded hex values in components