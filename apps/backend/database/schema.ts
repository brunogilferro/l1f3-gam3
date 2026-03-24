/**
 * This file is maintained manually.
 * Schema generation is disabled because tables use PascalCase (Postgres case-sensitive).
 * Update this file when migrations change the database structure.
 */

import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class AuthAccessTokenSchema extends BaseModel {
  static table = 'auth_access_tokens'

  static $columns = [
    'abilities',
    'createdAt',
    'expiresAt',
    'hash',
    'id',
    'lastUsedAt',
    'name',
    'tokenableId',
    'type',
    'updatedAt',
  ] as const
  $columns = AuthAccessTokenSchema.$columns

  @column({ isPrimary: true })
  declare id: number
  @column()
  declare tokenableId: number
  @column()
  declare type: string
  @column()
  declare name: string | null
  @column()
  declare hash: string
  @column()
  declare abilities: string
  @column.dateTime()
  declare createdAt: DateTime | null
  @column.dateTime()
  declare updatedAt: DateTime | null
  @column.dateTime()
  declare lastUsedAt: DateTime | null
  @column.dateTime()
  declare expiresAt: DateTime | null
}
