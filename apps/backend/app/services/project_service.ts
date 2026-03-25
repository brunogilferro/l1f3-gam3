import type { Project, Projects, ProjectTables } from '#types/db_rows/project'
import type { QueryResult } from '#types/db_rows/shared'
import db from '@adonisjs/lucid/services/db'

type ProjectRole = 'project_leader' | 'participant'
type TableRole = 'project_leader' | 'table_leader' | 'dealer' | 'player'

const STATUS_MAP: Record<string, string> = {
  ativo: 'active',
  finalizado: 'finished',
  pausado: 'paused',
}

const GAME_TYPE_MAP: Record<string, string> = {
  torneio: 'tournament',
  cash_game: 'cash_game',
}

const CYCLE_FREQUENCY_MAP: Record<string, string> = {
  semanal: 'weekly',
  quinzenal: 'biweekly',
  mensal: 'monthly',
}

const TABLE_STATUS_MAP: Record<string, string> = {
  ativa: 'active',
  finalizada: 'finished',
}

const TABLE_TYPE_MAP: Record<string, string> = {
  independente: 'independent',
  dependente: 'dependent',
}

/**
 * SQL fragment that checks if a user has any participation in a project.
 * Used in WHERE clauses across multiple queries to ensure scoped access.
 *
 * Roles are derived implicitly from FK references:
 *   - project_leader: Projetos.CodigoLiderProjeto
 *   - table_leader:   Projetos_Mesas.CodigoLiderMesa
 *   - dealer:         Projetos_Mesas.CodigoDealer
 *   - player:         Projetos_Mesas_Participantes.CodigoPlayer
 */
const USER_ACCESS_FRAGMENT = `(
  p."CodigoLiderProjeto" = ?
  OR m."CodigoLiderMesa" = ?
  OR m."CodigoDealer" = ?
  OR mp."CodigoPlayer" = ?
)`

export default class ProjectService {
  /**
   * Returns all projects the user participates in (any role),
   * with derived role and table count.
   *
   * rawQuery: requires GROUP BY + COUNT DISTINCT + role derivation across 4 tables.
   */
  async list(userId: number) {
    const rows = await db.rawQuery<QueryResult<Projects>>(
      `SELECT
         p."CodigoProjeto"        AS project_id,
         p."Nome"                 AS name,
         p."Descricao"            AS description,
         sp."Codigo"              AS status,
         tg."Codigo"              AS game_type,
         p."Deadline"             AS deadline,
         p."TotalMaosPlanejadas"  AS total_planned_hands,
         p."CicloAtual"           AS current_cycle,
         fc."Codigo"              AS cycle_frequency,
         p."CodigoLiderProjeto"   AS leader_id,
         p."CodigoSetor"          AS sector_id,
         p."CriadoEm"             AS created_at,
         (p."CodigoLiderProjeto" = ?) AS is_project_leader,
         COUNT(DISTINCT m."CodigoMesa")::int AS table_count
       FROM "Projetos" p
       JOIN "Projetos_StatusProjeto" sp      ON sp."CodigoStatusProjeto"     = p."CodigoStatusProjeto"
       JOIN "Projetos_TipoJogo" tg           ON tg."CodigoTipoJogo"          = p."CodigoTipoJogo"
       LEFT JOIN "Projetos_FrequenciaCiclo" fc ON fc."CodigoFrequenciaCiclo" = p."CodigoFrequenciaCiclo"
       LEFT JOIN "Projetos_Mesas" m          ON m."CodigoProjeto"            = p."CodigoProjeto"
       LEFT JOIN "Projetos_Mesas_Participantes" mp
         ON mp."CodigoMesa" = m."CodigoMesa"
         AND mp."CodigoPlayer" = ?
         AND mp."Ativo" = true
       WHERE ${USER_ACCESS_FRAGMENT}
       GROUP BY p."CodigoProjeto", sp."Codigo", tg."Codigo", fc."Codigo"
       ORDER BY p."CriadoEm" DESC`,
      [userId, userId, userId, userId, userId, userId]
    )

    return rows.rows.map((row: Projects) => ({
      id: row.project_id,
      name: row.name,
      description: row.description,
      status: STATUS_MAP[row.status] ?? row.status,
      gameType: GAME_TYPE_MAP[row.game_type] ?? row.game_type,
      deadline: row.deadline,
      totalPlannedHands: row.total_planned_hands,
      currentCycle: row.current_cycle,
      cycleFrequency: row.cycle_frequency
        ? (CYCLE_FREQUENCY_MAP[row.cycle_frequency] ?? row.cycle_frequency)
        : null,
      leaderId: row.leader_id,
      sectorId: row.sector_id,
      role: (row.is_project_leader ? 'project_leader' : 'participant') as ProjectRole,
      tableCount: row.table_count,
      createdAt: row.created_at,
    }))
  }

  /**
   * Returns a single project the user has access to, with its tables.
   * Returns null if project does not exist or user has no access.
   *
   * rawQuery: requires EXISTS access check + role derivation.
   */
  async find(projectId: number, userId: number) {
    const rows = await db.rawQuery<QueryResult<Project>>(
      `SELECT
         p."CodigoProjeto"        AS project_id,
         p."Nome"                 AS name,
         p."Descricao"            AS description,
         sp."Codigo"              AS status,
         tg."Codigo"              AS game_type,
         p."Deadline"             AS deadline,
         p."TotalMaosPlanejadas"  AS total_planned_hands,
         p."CicloAtual"           AS current_cycle,
         fc."Codigo"              AS cycle_frequency,
         p."CodigoLiderProjeto"   AS leader_id,
         p."CodigoSetor"          AS sector_id,
         p."CriadoEm"             AS created_at,
         p."AtualizadoEm"         AS updated_at,
         (p."CodigoLiderProjeto" = ?) AS is_project_leader,
         EXISTS (
           SELECT 1
           FROM "Projetos_Mesas" m2
           LEFT JOIN "Projetos_Mesas_Participantes" mp2
             ON mp2."CodigoMesa" = m2."CodigoMesa"
             AND mp2."CodigoPlayer" = ?
             AND mp2."Ativo" = true
           WHERE m2."CodigoProjeto" = p."CodigoProjeto"
             AND (
               p."CodigoLiderProjeto" = ?
               OR m2."CodigoLiderMesa" = ?
               OR m2."CodigoDealer" = ?
               OR mp2."CodigoPlayer" = ?
             )
         ) AS has_access
       FROM "Projetos" p
       JOIN "Projetos_StatusProjeto" sp        ON sp."CodigoStatusProjeto"     = p."CodigoStatusProjeto"
       JOIN "Projetos_TipoJogo" tg             ON tg."CodigoTipoJogo"          = p."CodigoTipoJogo"
       LEFT JOIN "Projetos_FrequenciaCiclo" fc ON fc."CodigoFrequenciaCiclo"   = p."CodigoFrequenciaCiclo"
       WHERE p."CodigoProjeto" = ?`,
      [userId, userId, userId, userId, userId, userId, projectId]
    )

    const project = rows.rows[0]
    if (!project || !project.has_access) return null

    const tables = await this.listTables(projectId, userId)

    return {
      id: project.project_id,
      name: project.name,
      description: project.description,
      status: STATUS_MAP[project.status] ?? project.status,
      gameType: GAME_TYPE_MAP[project.game_type] ?? project.game_type,
      deadline: project.deadline,
      totalPlannedHands: project.total_planned_hands,
      currentCycle: project.current_cycle,
      cycleFrequency: project.cycle_frequency
        ? (CYCLE_FREQUENCY_MAP[project.cycle_frequency] ?? project.cycle_frequency)
        : null,
      leaderId: project.leader_id,
      sectorId: project.sector_id,
      role: (project.is_project_leader ? 'project_leader' : 'player') as ProjectRole,
      tables,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    }
  }

  /**
   * Returns tables of a project scoped to the user's access.
   *
   * rawQuery: requires COUNT DISTINCT for participant count + role derivation
   * across project_leader / table_leader / dealer / player in a single pass.
   */
  async listTables(projectId: number, userId: number) {
    const rows = await db.rawQuery<QueryResult<ProjectTables>>(
      `SELECT
         m."CodigoMesa"       AS table_id,
         m."Nome"             AS name,
         m."Descricao"        AS description,
         m."Objetivo"         AS objective,
         sm."Codigo"          AS status,
         tm."Codigo"          AS type,
         m."LinkReuniao"      AS meeting_link,
         m."CodigoLiderMesa"  AS leader_id,
         m."CodigoDealer"     AS dealer_id,
         m."CodigoMesaPai"    AS parent_table_id,
         m."CriadoEm"         AS created_at,
         COUNT(DISTINCT mp2."CodigoPlayer")::int AS participant_count,
         (p."CodigoLiderProjeto" = ?) AS is_project_leader,
         (m."CodigoLiderMesa"    = ?) AS is_table_leader,
         (m."CodigoDealer"       = ?) AS is_dealer,
         (mp."CodigoPlayer" IS NOT NULL) AS is_participant
       FROM "Projetos_Mesas" m
       JOIN "Projetos" p                    ON p."CodigoProjeto"     = m."CodigoProjeto"
       JOIN "Projetos_Mesas_StatusMesa" sm  ON sm."CodigoStatusMesa" = m."CodigoStatusMesa"
       JOIN "Projetos_Mesas_TipoMesa" tm    ON tm."CodigoTipoMesa"   = m."CodigoTipoMesa"
       LEFT JOIN "Projetos_Mesas_Participantes" mp
         ON mp."CodigoMesa" = m."CodigoMesa"
         AND mp."CodigoPlayer" = ?
         AND mp."Ativo" = true
       LEFT JOIN "Projetos_Mesas_Participantes" mp2
         ON mp2."CodigoMesa" = m."CodigoMesa"
         AND mp2."Ativo" = true
       WHERE m."CodigoProjeto" = ?
         AND ${USER_ACCESS_FRAGMENT}
       GROUP BY m."CodigoMesa", p."CodigoLiderProjeto", sm."Codigo", tm."Codigo", mp."CodigoPlayer"
       ORDER BY m."CriadoEm" ASC`,
      [userId, userId, userId, userId, projectId, userId, userId, userId, userId]
    )

    return rows.rows.map((row: ProjectTables) => {
      let role: TableRole = 'player'
      if (row.is_project_leader) role = 'project_leader'
      else if (row.is_table_leader) role = 'table_leader'
      else if (row.is_dealer) role = 'dealer'

      return {
        id: row.table_id,
        name: row.name,
        description: row.description,
        objective: row.objective,
        status: TABLE_STATUS_MAP[row.status] ?? row.status,
        type: TABLE_TYPE_MAP[row.type] ?? row.type,
        meetingLink: row.meeting_link,
        leaderId: row.leader_id,
        dealerId: row.dealer_id,
        parentTableId: row.parent_table_id,
        participantCount: row.participant_count,
        role,
        createdAt: row.created_at,
      }
    })
  }
}
