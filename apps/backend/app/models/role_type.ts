import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RoleType extends BaseModel {
  static table = 'Players_TipoPerfil'

  @column({ isPrimary: true, columnName: 'CodigoTipoPerfil' })
  declare id: number

  @column({ columnName: 'Codigo' })
  declare code: string

  @column({ columnName: 'Nome' })
  declare name: string
}
