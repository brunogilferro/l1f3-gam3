import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import AccountService from '#services/account_service'

@inject()
export default class AccountController {
  constructor(private accountService: AccountService) {}

  async profile({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async context({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const context = await this.accountService.getContext(user.id)
    return response.ok({ data: context })
  }
}
