import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Project extends BaseModel {
  static table = 'Projetos'

  @column({ isPrimary: true, columnName: 'CodigoProjeto' })
  declare id: number

  @column({ columnName: 'Nome' })
  declare name: string

  @column({ columnName: 'Descricao' })
  declare description: string | null

  @column({ columnName: 'CodigoLiderProjeto' })
  declare leaderId: number

  @column({ columnName: 'CodigoOrganizacao' })
  declare organizationId: number | null

  @column({ columnName: 'CodigoSetor' })
  declare sectorId: number | null

  @column({ columnName: 'CodigoStatusProjeto' })
  declare statusId: number

  @column({ columnName: 'CodigoTipoJogo' })
  declare gameTypeId: number

  @column({ columnName: 'Deadline' })
  declare deadline: string | null

  @column({ columnName: 'TotalMaosPlanejadas' })
  declare totalPlannedHands: number | null

  @column({ columnName: 'CicloAtual' })
  declare currentCycle: number | null

  @column({ columnName: 'CodigoFrequenciaCiclo' })
  declare cycleFrequencyId: number | null

  @column({ columnName: 'CriadoPor' })
  declare createdBy: number

  @column.dateTime({ columnName: 'CriadoEm', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'AtualizadoEm', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
