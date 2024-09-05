import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeDownloadController } from '../factories/download'

const downloadRoutes = (router: Router): void => {
  router.get('/music/:id', adaptRoute(makeDownloadController()))
}

export default downloadRoutes
