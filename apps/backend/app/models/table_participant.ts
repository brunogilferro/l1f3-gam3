import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class TableParticipant extends BaseModel {
  static table = 'Projetos_Mesas_Participantes'

  // Composite PK: CodigoMesa + CodigoPlayer
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
