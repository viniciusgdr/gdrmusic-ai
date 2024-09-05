import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSearchController } from '../factories/search'

const searchRoutes = (router: Router): void => {
  router.get('/search', adaptRoute(makeSearchController()))
}

export default searchRoutes
