import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Table extends BaseModel {
  static table = 'Projetos_Mesas'

  @column({ isPrimary: true, columnName: 'CodigoMesa' })
  declare id: number

  @column({ columnName: 'CodigoProjeto' })
  declare projectId: number

  @column({ columnName: 'Nome' })
  declare name: string

  @column({ columnName: 'Descricao' })
  declare description: string | null

  @column({ columnName: 'Objetivo' })
  declare objective: string | null

  @column({ columnName: 'CodigoTipoMesa' })
  declare typeId: number

  @column({ columnName: 'CodigoStatusMesa' })
  declare statusId: number

  @column({ columnName: 'CodigoNivelMesa' })
  declare levelId: number

  @column({ columnName: 'CodigoLiderMesa' })
  declare leaderId: number

  @column({ columnName: 'CodigoDealer' })
  declare dealerId: number

  @column({ columnName: 'CodigoMesaPai' })
  declare parentTableId: number | null

  @column({ columnName: 'LinkReuniao' })
  declare meetingLink: string | null

  @column.dateTime({ columnName: 'CriadoEm', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'AtualizadoEm', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
