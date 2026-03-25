/**
 * Raw query result types for PostgreSQL queries.
 *
 * WHY raw queries instead of Lucid query builder?
 * - Tables use PascalCase names (e.g. "Projetos_Mesas") — Lucid/Knex
 *   mishandles quoting in some contexts (confirmed breakage in migrations).
 * - Complex role derivation queries use CASE WHEN, EXISTS, COUNT DISTINCT
 *   across multiple JOINs — raw SQL is clearer than builder chains.
 *
 * PATTERN: db.rawQuery<QueryResult<RowType>>(sql, bindings)
 *
 * Example:
 *   const result = await db.rawQuery<QueryResult<Projects>>(sql, [userId])
 *   result.rows.map(row => ...)
 */
export type QueryResult<T> = { rows: T[] }

// ─── Projects ────────────────────────────────────────────────────────────────

export type Projects = {
  project_id: number
  name: string
  description: string | null
  status: string
  game_type: string
  deadline: string | null
  total_planned_hands: number | null
  current_cycle: number | null
  cycle_frequency: string | null
  leader_id: number
  sector_id: number | null
  created_at: string
  is_project_leader: boolean
  table_count: number
}

export type Project = Projects & {
  updated_at: string
  has_access: boolean
}

// ─── ProjectTables ────────────────────────────────────────────────────────────

export type ProjectTables = {
  table_id: number
  name: string
  description: string | null
  objective: string | null
  status: string
  type: string
  meeting_link: string | null
  leader_id: number
  dealer_id: number
  parent_table_id: number | null
  participant_count: number
  is_project_leader: boolean
  is_table_leader: boolean
  is_dealer: boolean
  is_participant: boolean
  created_at: string
}

// ─── Account / Context ────────────────────────────────────────────────────────

export type AccountContext = {
  table_id: number
  table_name: string
  meeting_link: string | null
  project_id: number
  project_name: string
  is_project_leader: boolean
  is_table_leader: boolean
  is_dealer: boolean
  is_participant: boolean
}
