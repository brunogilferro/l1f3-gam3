import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * Composite PK: CodigoMesa + CodigoPlayer
 * Lucid does not support composite PKs natively.
 * Always query with .where('CodigoMesa', x).andWhere('CodigoPlayer', y)
 */
export default class ProjectTableParticipant extends BaseModel {
  static table = 'Projetos_Mesas_Participantes'
  static selfAssignPrimaryKey = true

  @column({ columnName: 'CodigoMesa' })
  declare tableId: number

  @column({ columnName: 'CodigoProjeto' })
  declare projectId: number

  @column({ columnName: 'CodigoPlayer' })
  declare playerId: number

  @column({ columnName: 'Ativo' })
  declare active: boolean

  @column({ columnName: 'Ausente' })
  declare absent: boolean

  @column.dateTime({ columnName: 'DataUltimaAtualizacao' })
  declare lastUpdatedAt: DateTime | null

  @column.dateTime({ columnName: 'DataRemocao' })
  declare removedAt: DateTime | null
}
