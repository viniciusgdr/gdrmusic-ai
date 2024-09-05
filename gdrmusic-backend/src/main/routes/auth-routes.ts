import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters/express-route-adapter'
import { makeAuthorizationMiddleware } from '../factories/make-authorization'
import { SessionController } from '../../presentation/controllers/auth/session'

const authRoutes = (router: Router): void => {
  const authRouter = Router()
  router.use('/auth', authRouter)

  authRouter.get(
    '/session',
    adaptMiddleware(makeAuthorizationMiddleware()),
    adaptRoute(new SessionController())
  )
}

export default authRoutes
