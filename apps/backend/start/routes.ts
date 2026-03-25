/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('login', [controllers.Auth, 'store'])
        router.post('logout', [controllers.Auth, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Account, 'profile'])
        router.get('/context', [controllers.Account, 'context'])
      })
      .prefix('account')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Project, 'index'])
        router.get('/:id', [controllers.Project, 'show'])
        router.get('/:id/tables', [controllers.Project, 'tables'])
      })
      .prefix('projects')
      .as('projects')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
