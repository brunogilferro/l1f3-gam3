import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'fullName',
      'shortName',
      'email',
      'avatarUrl',
      'sectorId',
      'chronotypeId',
      'firstAccess',
      'onboardingComplete',
      'active',
      'isAi',
      'lastLoginAt',
      'createdAt',
      'updatedAt',
      'initials',
    ])
  }
}
