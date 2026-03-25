import User from '#models/user'
import AccountService from '#services/account_service'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import {
  makeParticipant,
  makeProject,
  makeProjectTable,
  makeUser,
  makeUserRole,
} from '../../helpers/factories.js'

const service = new AccountService()

// ─── globalRoles ──────────────────────────────────────────────────────────────
// withGlobalTransaction does not cover manyToMany preload subqueries (they open
// a secondary connection outside the transaction). This group commits data and
// cleans up manually after each test.

test.group('AccountService.getContext / globalRoles', (group) => {
  let createdUserId: number | undefined

  group.each.teardown(async () => {
    if (createdUserId) {
      await db.from('Players_Perfis').where('CodigoPlayer', createdUserId).delete()
      await User.query().where('id', createdUserId).delete()
      createdUserId = undefined
    }
  })

  test('returns globalRoles from Players_Perfis', async ({ assert }) => {
    const user = await makeUser()
    createdUserId = user.id
    // CodigoTipoPerfil=5 is 'jogador' (seeded lookup, never changes)
    await makeUserRole(user.id, 5)

    const result = await service.getContext(user.id)

    assert.includeMembers(result.globalRoles, ['player'])
  })
})

// ─── getContext ───────────────────────────────────────────────────────────────

test.group('AccountService.getContext', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('returns empty context for user with no projects', async ({ assert }) => {
    const user = await makeUser()

    const result = await service.getContext(user.id)

    assert.deepEqual(result.globalRoles, [])
    assert.deepEqual(result.projects, [])
  })

  test('includes project where user is project_leader', async ({ assert }) => {
    const user = await makeUser()
    const project = await makeProject(user.id)
    await makeProjectTable(project.id, user.id, user.id)

    const result = await service.getContext(user.id)

    assert.lengthOf(result.projects, 1)
    assert.equal(result.projects[0].projectId, project.id)
    assert.equal(result.projects[0].projectRole, 'project_leader')
  })

  test('includes project where user is table_leader', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, user.id, owner.id)

    const result = await service.getContext(user.id)

    assert.lengthOf(result.projects, 1)
    assert.equal(result.projects[0].projectRole, 'participant')
  })

  test('includes project where user is player', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    const table = await makeProjectTable(project.id, owner.id, owner.id)
    await makeParticipant(table.id, project.id, user.id)

    const result = await service.getContext(user.id)

    assert.lengthOf(result.projects, 1)
  })

  test('groups tables under their project', async ({ assert }) => {
    const user = await makeUser()
    const project = await makeProject(user.id)
    await makeProjectTable(project.id, user.id, user.id)
    await makeProjectTable(project.id, user.id, user.id)

    const result = await service.getContext(user.id)

    assert.lengthOf(result.projects, 1)
    assert.lengthOf(result.projects[0].tables, 2)
  })

  test('returns correct tableRole for each table', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    const leaderTable = await makeProjectTable(project.id, user.id, owner.id)
    const dealerTable = await makeProjectTable(project.id, owner.id, user.id)
    const playerTable = await makeProjectTable(project.id, owner.id, owner.id)
    await makeParticipant(playerTable.id, project.id, user.id)

    const result = await service.getContext(user.id)
    const tables = result.projects[0].tables

    const roles = tables.map((t) => ({ id: t.tableId, role: t.tableRole }))
    assert.deepInclude(roles, { id: leaderTable.id, role: 'table_leader' })
    assert.deepInclude(roles, { id: dealerTable.id, role: 'dealer' })
    assert.deepInclude(roles, { id: playerTable.id, role: 'player' })
  })

  test('does not duplicate project when user has multiple roles in same project', async ({
    assert,
  }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    const table1 = await makeProjectTable(project.id, user.id, owner.id)
    await makeProjectTable(project.id, owner.id, user.id)
    await makeParticipant(table1.id, project.id, user.id)

    const result = await service.getContext(user.id)

    assert.lengthOf(result.projects, 1)
  })
})
