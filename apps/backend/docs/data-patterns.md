# Backend Data Patterns

## Why `rawQuery` instead of Lucid query builder?

Two reasons specific to this project:

### 1. PascalCase table names

The PostgreSQL schema uses PascalCase identifiers (e.g. `"Projetos_Mesas"`).
Lucid/Knex mishandles quoting for these names in certain contexts — confirmed
breakage in migrations. Raw SQL with explicit double-quotes is safe and
predictable.

### 2. Complex role derivation

User roles in this system are **implicit** — there is no `role` column in
`Projetos_Mesas_Participantes`. Roles are derived from FK references:

| Role             | Derived from                          |
| ---------------- | ------------------------------------- |
| `project_leader` | `Projetos.CodigoLiderProjeto = userId` |
| `table_leader`   | `Projetos_Mesas.CodigoLiderMesa = userId` |
| `dealer`         | `Projetos_Mesas.CodigoDealer = userId` |
| `player`         | `Projetos_Mesas_Participantes.CodigoPlayer = userId` (none of the above) |

This requires `CASE WHEN`, `EXISTS`, and `COUNT DISTINCT` across multiple
JOINs. Raw SQL is clearer and more maintainable than equivalent query-builder
chains.

---

## The `QueryResult<T>` pattern

`db.rawQuery` returns `{ rows: T[] }`. We use a generic alias to avoid
repeating that wrapper inline on every call.

**Type file:** `app/types/raw_query.ts`

```ts
export type QueryResult<T> = { rows: T[] }
```

**Usage:**

```ts
import db from '@adonisjs/lucid/services/db'
import type { QueryResult, Projects } from '#types/raw_query'

const result = await db.rawQuery<QueryResult<Projects>>(sql, [userId])
result.rows.map((row) => row.project_id)
```

**Types defined in `app/types/raw_query.ts`:**

| Type         | Used in                         |
| ------------ | ------------------------------- |
| `Projects`   | `ProjectService.list`           |
| `Project`    | `ProjectService.find`           |
| `Tables`     | `ProjectService.listTables`     |
| `RoleRow`    | `MeContextController.show`      |
| `ContextRow` | `MeContextController.show`      |

---

## Lookup value mapping

DB lookup tables store codes in Portuguese (e.g. `ativo`, `finalizado`).
The API layer maps these to English before returning the response.

Pattern — constant map at the top of the service:

```ts
const STATUS_MAP: Record<string, string> = {
  ativo: 'active',
  finalizado: 'finished',
  pausado: 'paused',
}

// In the mapper:
status: STATUS_MAP[row.status] ?? row.status,
```

The `?? row.status` fallback ensures unknown codes pass through instead of
silently dropping data.
