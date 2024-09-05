import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeMusicsLatestController } from '../factories/musics-latest'

const searchRoutes = (router: Router): void => {
  router.get('/musics/latest', adaptRoute(makeMusicsLatestController()))
}

export default searchRoutes
