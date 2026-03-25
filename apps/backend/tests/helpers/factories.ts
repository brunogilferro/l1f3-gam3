import Project from '#models/project'
import ProjectTable from '#models/project_table'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

// Lookup IDs (seeded, never change)
export const LOOKUP = {
  project: { statusActive: 1, gameTypeTournament: 1 },
  table: { statusActive: 1, typeIndependent: 1, levelAttraction: 1 },
} as const

let seq = 0
const next = () => ++seq

// ─── User ────────────────────────────────────────────────────────────────────

type UserOverrides = Partial<{
  fullName: string
  shortName: string
  email: string
  sectorId: number | null
}>

export async function makeUser(overrides: UserOverrides = {}) {
  const n = next()
  return User.create({
    fullName: overrides.fullName ?? `User ${n}`,
    shortName: overrides.shortName ?? `user${n}`,
    email: overrides.email ?? `user${n}@test.com`,
    password: '$scrypt$n=16384,r=8,p=1$test$testhash', // not used in service tests
    active: true,
    firstAccess: false,
    onboardingComplete: true,
    isAi: false,
    sectorId: overrides.sectorId ?? null,
  })
}

// ─── Project ─────────────────────────────────────────────────────────────────

type ProjectOverrides = Partial<{
  name: string
  statusId: number
  gameTypeId: number
  sectorId: number | null
}>

export async function makeProject(leaderId: number, overrides: ProjectOverrides = {}) {
  const n = next()
  return Project.create({
    name: overrides.name ?? `Project ${n}`,
    leaderId,
    createdBy: leaderId,
    statusId: overrides.statusId ?? LOOKUP.project.statusActive,
    gameTypeId: overrides.gameTypeId ?? LOOKUP.project.gameTypeTournament,
    sectorId: overrides.sectorId ?? null,
  })
}

// ─── ProjectTable ─────────────────────────────────────────────────────────────

type ProjectTableOverrides = Partial<{
  name: string
  statusId: number
  typeId: number
  levelId: number
  parentTableId: number | null
}>

export async function makeProjectTable(
  projectId: number,
  leaderId: number,
  dealerId: number,
  overrides: ProjectTableOverrides = {}
) {
  const n = next()
  return ProjectTable.create({
    projectId,
    name: overrides.name ?? `Table ${n}`,
    leaderId,
    dealerId,
    statusId: overrides.statusId ?? LOOKUP.table.statusActive,
    typeId: overrides.typeId ?? LOOKUP.table.typeIndependent,
    levelId: overrides.levelId ?? LOOKUP.table.levelAttraction,
    parentTableId: overrides.parentTableId ?? null,
  })
}

// ─── User role ───────────────────────────────────────────────────────────────
// Uses raw insert — composite PK on Players_Perfis.

export async function makeUserRole(playerId: number, roleTypeId: number) {
  await db.rawQuery(
    `INSERT INTO "Players_Perfis" ("CodigoPlayer", "CodigoTipoPerfil") VALUES (?, ?)`,
    [playerId, roleTypeId]
  )
}

// ─── ProjectTableParticipant ──────────────────────────────────────────────────
// Uses raw insert — Lucid does not support composite PKs.

export async function makeParticipant(tableId: number, projectId: number, playerId: number) {
  await db.table('Projetos_Mesas_Participantes').insert({
    CodigoMesa: tableId,
    CodigoProjeto: projectId,
    CodigoPlayer: playerId,
    Ativo: true,
    Ausente: false,
  })
}
