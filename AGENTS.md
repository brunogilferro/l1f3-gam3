# BETTER SYSTEM - AGENTS

You are a senior fullstack engineer working inside Better System — a reusable AI-powered development template.

---

## Project Structure

- Frontend → `apps/frontend` (Next.js)
- Backend → `apps/backend` (AdonisJS)

---

## Core Principle

Always choose **consistency over creativity**.

When in doubt: follow existing patterns. Do NOT invent new structures.

---

## Mandatory Rules

You MUST read and follow these files before generating any code:

| File | Purpose |
|------|---------|
| `docs/design-system.md` | Spacing, layout, typography scale, interaction rules |
| `docs/figma-design-rules.md` | Project colors, fonts, visual identity (project-specific) |
| `docs/components-registry.md` | Which components exist and how to use them |
| `docs/data-pattern.md` | Data flow: Component → Hook → Service → API |
| `docs/api-conventions.md` | API response format, status codes, pagination |
| `docs/error-handling.md` | How to handle and display errors (frontend + backend) |
| `docs/state-management.md` | When to use useState / useReducer / Context / Zustand |

---

## Architecture Separation

This system has 3 layers. Do not mix them:

### 1. System Level (`docs/design-system.md`)
Defines structural rules:
- Spacing scale
- Border radius
- Typography size scale
- Layout patterns
- Interaction states
- Motion rules

Does NOT define: colors, font families, branding.

### 2. Project Level (`docs/figma-design-rules.md`)
Defines visual identity per project:
- Color tokens
- Font families
- Theme (dark/light)

Must be updated for each new project.

### 3. Component Level (`docs/components-registry.md`)
Defines which components exist and their rules.
Never create a component that already exists.

---

## Next.js Rules

- Use App Router (`app/`)
- Prefer Server Components by default
- Use `'use client'` only when necessary (interactivity, hooks, browser APIs)
- Do NOT use legacy APIs (`getServerSideProps`, `getStaticProps`, Pages Router)
- Read `apps/frontend/AGENTS.md` for version-specific guidance

---

## Backend Rules (AdonisJS)

- Use services for business logic (`app/services/`)
- Keep controllers thin — delegate to services
- Use validators for all input (`app/validators/`)
- Use transformers to serialize responses (`app/transformers/`)
- All responses wrapped via `ctx.serialize()` → `{ data: ... }`
- See `docs/api-conventions.md` for full response format and patterns

### rawQuery vs Lucid

Use **Lucid ORM / query builder** by default. Only use **`db.rawQuery`** when the query requires:

| Condition | Example |
|---|---|
| Role derivation via FK boolean checks | `(p."CodigoLiderProjeto" = ?) AS is_leader` |
| `COUNT DISTINCT` with `GROUP BY` | participant count per table |
| `EXISTS` subqueries for access checks | user has any participation in project |
| Complex `OR` conditions across multiple joined tables | leader OR table_leader OR dealer OR participant |

**Rules when using rawQuery:**
- Add a JSDoc comment explaining why Lucid is insufficient for that query
- Extract repeated SQL fragments (e.g. access check `WHERE` clause) as named string constants
- Type the result with `QueryResult<T>` from `#types/raw_query`
- Always convert snake_case DB rows to camelCase inside `.map()` immediately after the query

---

## Component Library

**shadcn/ui is the standard component library.**

Rules:
- Always check shadcn before building any component
- Install via CLI: `npx shadcn@latest add <component>`
- Installed components live in `components/ui/` — do not modify structure
- Customize appearance via CSS variables in `globals.css` (mapped to design tokens)
- Custom components built on top of shadcn live in `components/`
- See `docs/components-registry.md` for the full list and rules

---

## Frontend Folder Structure

```
apps/frontend/
├── app/               # Next.js App Router (routes, layouts, pages)
├── components/
│   ├── ui/            # shadcn/ui installed components (do not modify structure)
│   └── *.tsx          # Custom components built on top of shadcn
├── context/           # React Context providers
├── store/             # Zustand stores (only when needed)
├── hooks/             # Client-side data hooks
├── services/          # API service functions (use Tuyau client from lib/api.ts)
├── types/             # TypeScript domain types
└── lib/               # Utilities, helpers (api.ts, parse-error.ts, etc.)
```

---

## Data Flow

```
Component → Hook → Service → API (via lib/api.ts Tuyau client)
```

Server Components may call services directly (no hooks needed).

---

## Error Handling

All errors must be handled consistently — see `docs/error-handling.md`.
Never let errors fail silently. Always give the user feedback.

---

## Accessibility

Every component must meet basic a11y standards — see `.cursor/rules/accessibility.mdc`.

Key rules:
- All inputs must have visible labels
- Icon-only buttons must have `aria-label`
- Never remove focus rings

---

## Commits

Follow Conventional Commits format — see `.cursor/rules/commits.mdc`.

Pattern: `<type>(<scope>): <description>`
Example: `feat(auth): add password reset flow`

---

## Skills available

| Skill | Use when |
|-------|----------|
| `figma-to-next-screen` | Implementing a screen from Figma |
| `backend-from-schema` | Creating a new backend resource (table doesn't exist yet) |
| `backend-from-schema` + `[existing table]` | Backend for a table that already exists (skips migration) |
| `database-to-feature` | Project already has a database — generate backend from existing tables |
| `new-feature` | Creating a complete feature (backend + frontend) |
| `frontend-from-route` | Backend exists — generate types, service, hook, and page for a route |
| `create-component` | Creating a reusable UI component without Figma and without a full feature |
| `write-tests` | Writing tests for backend or frontend code |
| `refactor` | Adapting existing code to project standards (data flow, tokens, error handling) |
| `review-file` | Auditing a file against project standards — outputs a structured report |
| `a11y-review` | Auditing and fixing accessibility issues in a component or page |

---

## Naming Conventions

**All identifiers must be in English** — file names, class names, function names, variable names, type names, interface names, route names, JSON response keys.

| Layer | Rule | Example |
|-------|------|---------|
| Files | `snake_case` English, reflecting DB hierarchy | `project_table.ts`, `project_table_participant.ts` |
| Classes | `PascalCase` English, reflecting DB hierarchy | `class ProjectTable`, `class ProjectTableParticipant` |
| Variables / functions | `camelCase` English | `projectId`, `findByEmail()` |
| Types / interfaces | `PascalCase` English | `type TableRole`, `interface TableEntry` |
| API response keys | `camelCase` English | `{ projectId, tableName, tableRole }` |
| DB column mapping | Portuguese stays in `columnName` only | `@column({ columnName: 'CodigoProjeto' })` |
| Role values (from DB) | Map Portuguese codes to English in the API layer | `lider_projeto` → `project_leader` |

**Portuguese is only allowed inside `columnName` strings** — the bridge between English code and the existing Portuguese database schema.

### Entity naming mirrors DB table hierarchy

DB table names encode the parent-child relationship through prefixes (`Projetos_Mesas_Participantes` belongs to `Projetos_Mesas` which belongs to `Projetos`). Model files, classes, and raw query types **must mirror this hierarchy** in English:

| DB table | File | Class | Raw query type |
|---|---|---|---|
| `Projetos` | `project.ts` | `Project` | `Projects` / `Project` |
| `Projetos_Mesas` | `project_table.ts` | `ProjectTable` | `ProjectTables` |
| `Projetos_Mesas_Participantes` | `project_table_participant.ts` | `ProjectTableParticipant` | `ProjectTableParticipants` |
| `Projetos_Mesas_Maos` | `project_table_hand.ts` | `ProjectTableHand` | `ProjectTableHands` |

Rule: translate each segment of the DB table name to English, join with the parent prefix. Never abbreviate or drop the parent context.

### Naming conciseness

Avoid redundant suffixes and qualifiers — the surrounding context already provides the information:

| ❌ Verbose | ✅ Concise | Why |
|---|---|---|
| `listForUser(userId)` | `list(userId)` | param already says it's scoped to a user |
| `findForUser(id, userId)` | `find(id, userId)` | same |
| `listTablesForProject(id, userId)` | `listTables(id, userId)` | class name provides project context |
| `ProjectListRow` | `Projects` | it's a list of projects, "Row" is noise |
| `ProjectDetailRow` | `Project` | singular = detail |
| `TableListRow` | `Tables` | same as above |
| `TableContext` | `TableEntry` | "Context" doesn't add meaning |
| `ProjectContext` | `ProjectEntry` | same |
| `globalRolesRows` | `rolesResult` | drop the `Rows` suffix from variables |
| `tablesRows` | `tablesResult` | same |

Rule: if removing the suffix still leaves a clear name, remove it.

---

## Enforcement

- If a component exists in the registry → use it, do not recreate
- If a pattern exists in docs → follow it, do not invent alternatives
- If unsure → ask or follow the closest existing pattern
