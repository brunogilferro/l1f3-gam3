import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import RoleType from '#models/role_type'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'Players'

  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column({ isPrimary: true, columnName: 'CodigoPlayer' })
  declare id: number

  @column({ columnName: 'Nome' })
  declare fullName: string

  @column({ columnName: 'NomeCurto' })
  declare shortName: string

  @column({ columnName: 'Email' })
  declare email: string

  @column({ columnName: 'password', serializeAs: null })
  declare password: string

  @column({ columnName: 'AvatarUrl' })
  declare avatarUrl: string | null

  @column({ columnName: 'CodigoSetor' })
  declare sectorId: number | null

  @column({ columnName: 'CodigoCronotipo' })
  declare chronotypeId: number | null

  @column({ columnName: 'PrimeiroAcesso' })
  declare firstAccess: boolean

  @column({ columnName: 'OnboardingCompleto' })
  declare onboardingComplete: boolean

  @column({ columnName: 'Ativo' })
  declare active: boolean

  @column({ columnName: 'EhAI' })
  declare isAi: boolean

  @column.dateTime({ columnName: 'UltimoLoginEm' })
  declare lastLoginAt: DateTime | null

  @column.dateTime({ columnName: 'CriadoEm', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'AtualizadoEm', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => RoleType, {
    localKey: 'id',
    pivotTable: 'Players_Perfis',
    pivotForeignKey: 'CodigoPlayer',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'CodigoTipoPerfil',
  })
  declare roleTypes: ManyToMany<typeof RoleType>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
