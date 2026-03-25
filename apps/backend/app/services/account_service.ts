import User from '#models/user'
import type { AccountContext, QueryResult } from '#types/raw_query'
import db from '@adonisjs/lucid/services/db'

type GlobalRole = 'admin' | 'project_leader' | 'table_leader' | 'dealer' | 'player'
type TableRole = 'project_leader' | 'table_leader' | 'dealer' | 'player'

const ROLE_MAP: Record<string, GlobalRole> = {
  admin: 'admin',
  lider_projeto: 'project_leader',
  lider_mesa: 'table_leader',
  dealer: 'dealer',
  jogador: 'player',
}

interface ProjectTableEntry {
  tableId: number
  tableName: string
  tableRole: TableRole
  meetingLink: string | null
}

interface ProjectEntry {
  projectId: number
  projectName: string
  projectRole: 'project_leader' | 'participant'
  tables: ProjectTableEntry[]
}

export interface UserContext {
  globalRoles: GlobalRole[]
  projects: ProjectEntry[]
}

export default class AccountService {
  async getContext(userId: number): Promise<UserContext> {
    const user = await User.query().preload('roleTypes').where('id', userId).firstOrFail()

    const globalRoles: GlobalRole[] = user.roleTypes.map((rt) => ROLE_MAP[rt.code]).filter(Boolean)

    const tablesResult = await db.rawQuery<QueryResult<AccountContext>>(
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

    const projectsMap = new Map<number, ProjectEntry>()

    for (const row of tablesResult.rows) {
      let tableRole: TableRole = 'player'
      if (row.is_project_leader) tableRole = 'project_leader'
      else if (row.is_table_leader) tableRole = 'table_leader'
      else if (row.is_dealer) tableRole = 'dealer'

      const table: ProjectTableEntry = {
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

    return {
      globalRoles,
      projects: Array.from(projectsMap.values()),
    }
  }
}
