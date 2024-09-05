import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeOAuthAuthorizeController } from '../factories/oauth'

const downloadRoutes = (router: Router): void => {
  router.get('/oauth/authorize', adaptRoute(makeOAuthAuthorizeController()))
}

export default downloadRoutes
