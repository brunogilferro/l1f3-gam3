import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

type GlobalRole = 'admin' | 'project_leader' | 'table_leader' | 'dealer' | 'player'
type TableRole = 'project_leader' | 'table_leader' | 'dealer' | 'player'

// Maps DB Portuguese role codes to English API values
const ROLE_MAP: Record<string, GlobalRole> = {
  admin: 'admin',
  lider_projeto: 'project_leader',
  lider_mesa: 'table_leader',
  dealer: 'dealer',
  jogador: 'player',
}

interface TableContext {
  tableId: number
  tableName: string
  tableRole: TableRole
  meetingLink: string | null
}

interface ProjectContext {
  projectId: number
  projectName: string
  projectRole: 'project_leader' | 'participant'
  tables: TableContext[]
}

export default class MeContextController {
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const userId = user.id

    // 1. Global roles from Players_Perfis
    const globalRolesRows = await db.rawQuery<{ rows: { role_code: string }[] }>(
      `SELECT tp."Codigo" AS role_code
       FROM "Players_Perfis" pp
       JOIN "Players_TipoPerfil" tp ON tp."CodigoTipoPerfil" = pp."CodigoTipoPerfil"
       WHERE pp."CodigoPlayer" = ?`,
      [userId]
    )

    const globalRoles: GlobalRole[] = globalRolesRows.rows
      .map((r) => ROLE_MAP[r.role_code])
      .filter(Boolean)

    // 2. All tables the user participates in (any role), with derived role
    const tablesRows = await db.rawQuery<{
      rows: {
        table_id: number
        table_name: string
        meeting_link: string | null
        project_id: number
        project_name: string
        is_project_leader: boolean
        is_table_leader: boolean
        is_dealer: boolean
        is_participant: boolean
      }[]
    }>(
      `SELECT
         m."CodigoMesa"     AS table_id,
         m."Nome"           AS table_name,
         m."LinkReuniao"    AS meeting_link,
         p."CodigoProjeto"  AS project_id,
         p."Nome"           AS project_name,
         (p."CodigoLiderProjeto" = ?)  AS is_project_leader,
         (m."CodigoLiderMesa"    = ?)  AS is_table_leader,
         (m."CodigoDealer"       = ?)  AS is_dealer,
         (mp."CodigoPlayer" IS NOT NULL) AS is_participant
       FROM "Projetos_Mesas" m
       JOIN "Projetos" p ON p."CodigoProjeto" = m."CodigoProjeto"
       LEFT JOIN "Projetos_Mesas_Participantes" mp
         ON mp."CodigoMesa" = m."CodigoMesa"
         AND mp."CodigoPlayer" = ?
         AND mp."Ativo" = true
       WHERE
         p."CodigoLiderProjeto" = ?
         OR m."CodigoLiderMesa" = ?
         OR m."CodigoDealer" = ?
         OR mp."CodigoPlayer" = ?
       ORDER BY p."CodigoProjeto", m."CodigoMesa"`,
      [userId, userId, userId, userId, userId, userId, userId, userId]
    )

    // 3. Group tables by project and derive roles
    const projectsMap = new Map<number, ProjectContext>()

    for (const row of tablesRows.rows) {
      // Derive table role — priority: project_leader > table_leader > dealer > player
      let tableRole: TableRole = 'player'
      if (row.is_project_leader) tableRole = 'project_leader'
      else if (row.is_table_leader) tableRole = 'table_leader'
      else if (row.is_dealer) tableRole = 'dealer'

      const table: TableContext = {
        tableId: row.table_id,
        tableName: row.table_name,
        tableRole,
        meetingLink: row.meeting_link,
      }

      if (!projectsMap.has(row.project_id)) {
        projectsMap.set(row.project_id, {
          projectId: row.project_id,
          projectName: row.project_name,
          projectRole: row.is_project_leader ? 'project_leader' : 'participant',
          tables: [],
        })
      }

      projectsMap.get(row.project_id)!.tables.push(table)
    }

    return response.ok({
      data: {
        globalRoles,
        projects: Array.from(projectsMap.values()),
      },
    })
  }
}
