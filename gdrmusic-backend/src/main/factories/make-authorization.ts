import { AuthenticationMiddleware } from '../../presentation/middlewares/authentication'
import { type Middleware } from '../../presentation/protocols/middleware'

export const makeAuthorizationMiddleware = (): Middleware => {
  return new AuthenticationMiddleware()
}
