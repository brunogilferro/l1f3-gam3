import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import MeContextService from '#services/me_context_service'

@inject()
export default class AccountController {
  constructor(private meContextService: MeContextService) {}

  async profile({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async context({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const context = await this.meContextService.getContext(user.id)
    return response.ok({ data: context })
  }
}
