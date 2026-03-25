import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ProjectService from '#services/project_service'

@inject()
export default class ProjectController {
  constructor(private projectService: ProjectService) {}

  async index({ auth, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const projects = await this.projectService.list(userId)
    return response.ok({ data: projects })
  }

  async show({ auth, params, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const project = await this.projectService.find(Number(params.id), userId)

    if (!project) {
      return response.notFound({ errors: [{ message: 'Project not found or access denied.' }] })
    }

    return response.ok({ data: project })
  }

  async tables({ auth, params, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const tables = await this.projectService.listTables(Number(params.id), userId)
    return response.ok({ data: tables })
  }
}
