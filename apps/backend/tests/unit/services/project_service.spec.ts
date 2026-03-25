import ProjectService from '#services/project_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import {
  makeParticipant,
  makeProject,
  makeProjectTable,
  makeUser,
} from '../../helpers/factories.js'

const service = new ProjectService()

// ─── list ─────────────────────────────────────────────────────────────────────

test.group('ProjectService.list', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('returns project where user is project_leader', async ({ assert }) => {
    const user = await makeUser()
    const project = await makeProject(user.id)
    await makeProjectTable(project.id, user.id, user.id)

    const result = await service.list(user.id)

    assert.lengthOf(result, 1)
    assert.equal(result[0].id, project.id)
    assert.equal(result[0].role, 'project_leader')
  })

  test('returns project where user is table_leader', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, user.id, owner.id)

    const result = await service.list(user.id)

    assert.lengthOf(result, 1)
    assert.equal(result[0].role, 'participant')
  })

  test('returns project where user is dealer', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, owner.id, user.id)

    const result = await service.list(user.id)

    assert.lengthOf(result, 1)
    assert.equal(result[0].role, 'participant')
  })

  test('returns project where user is player', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    const table = await makeProjectTable(project.id, owner.id, owner.id)
    await makeParticipant(table.id, project.id, user.id)

    const result = await service.list(user.id)

    assert.lengthOf(result, 1)
    assert.equal(result[0].role, 'participant')
  })

  test('does not return projects user has no access to', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    await makeProject(owner.id)

    const result = await service.list(user.id)

    assert.lengthOf(result, 0)
  })

  test('returns correct table_count', async ({ assert }) => {
    const user = await makeUser()
    const project = await makeProject(user.id)
    await makeProjectTable(project.id, user.id, user.id)
    await makeProjectTable(project.id, user.id, user.id)

    const result = await service.list(user.id)

    assert.equal(result[0].tableCount, 2)
  })

  test('does not return duplicate project when user has multiple roles in different tables', async ({
    assert,
  }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    const table1 = await makeProjectTable(project.id, user.id, owner.id) // user is table_leader
    await makeParticipant(table1.id, project.id, user.id) // also player
    await makeProjectTable(project.id, owner.id, user.id) // user is dealer in another table

    const result = await service.list(user.id)

    assert.lengthOf(result, 1)
  })
})

// ─── find ─────────────────────────────────────────────────────────────────────

test.group('ProjectService.find', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('returns project with tables for project_leader', async ({ assert }) => {
    const user = await makeUser()
    const project = await makeProject(user.id)
    await makeProjectTable(project.id, user.id, user.id)

    const result = await service.find(project.id, user.id)

    assert.isNotNull(result)
    assert.equal(result!.id, project.id)
    assert.equal(result!.role, 'project_leader')
    assert.lengthOf(result!.tables, 1)
  })

  test('returns role participant for non-leader', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, user.id, owner.id)

    const result = await service.find(project.id, user.id)

    assert.isNotNull(result)
    assert.equal(result!.role, 'participant')
  })

  test('returns null if user has no access', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, owner.id, owner.id)

    const result = await service.find(project.id, user.id)

    assert.isNull(result)
  })

  test('returns null if project does not exist', async ({ assert }) => {
    const user = await makeUser()

    const result = await service.find(999999, user.id)

    assert.isNull(result)
  })

  test('returns correct table role for table_leader', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, user.id, owner.id)

    const result = await service.find(project.id, user.id)

    assert.isNotNull(result)
    assert.equal(result!.tables[0].role, 'table_leader')
  })

  test('returns correct table role for dealer', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    await makeProjectTable(project.id, owner.id, user.id)

    const result = await service.find(project.id, user.id)

    assert.isNotNull(result)
    assert.equal(result!.tables[0].role, 'dealer')
  })

  test('returns correct table role for player', async ({ assert }) => {
    const owner = await makeUser()
    const user = await makeUser()
    const project = await makeProject(owner.id)
    const table = await makeProjectTable(project.id, owner.id, owner.id)
    await makeParticipant(table.id, project.id, user.id)

    const result = await service.find(project.id, user.id)

    assert.isNotNull(result)
    assert.equal(result!.tables[0].role, 'player')
  })

  test('returns correct participant_count', async ({ assert }) => {
    const owner = await makeUser()
    const player1 = await makeUser()
    const player2 = await makeUser()
    const project = await makeProject(owner.id)
    const table = await makeProjectTable(project.id, owner.id, owner.id)
    await makeParticipant(table.id, project.id, player1.id)
    await makeParticipant(table.id, project.id, player2.id)

    const result = await service.find(project.id, owner.id)

    assert.equal(result!.tables[0].participantCount, 2)
  })
})
