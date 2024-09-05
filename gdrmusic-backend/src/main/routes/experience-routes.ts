import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters/express-route-adapter'
import { makeAuthorizationMiddleware } from '../factories/make-authorization'
import { ExperienceCategoriesController } from '../../presentation/controllers/experience/categories'

const experienceRoutes = (router: Router): void => {
  const experienceRouter = Router()
  router.use('/experience', experienceRouter)

  experienceRouter.post('/categories', adaptMiddleware(makeAuthorizationMiddleware()), adaptRoute(new ExperienceCategoriesController()))
}

export default experienceRoutes
