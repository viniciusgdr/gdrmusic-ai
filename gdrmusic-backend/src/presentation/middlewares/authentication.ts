import { prismaClient } from '../../main/server'
import { notAuthorized, ok, serverError } from '../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols'
import { type Middleware } from '../protocols/middleware'

export class AuthenticationMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { authorization } = httpRequest.headers
      if (!authorization) {
        return notAuthorized(new Error('Unauthorized'))
      }
      if (authorization.split(' ').length !== 2) {
        return notAuthorized(new Error('Unauthorized'))
      }
      const [type, token] = authorization.split(' ')
      if ((type !== 'Bearer' && type !== 'bearer') || !token) {
        return notAuthorized(new Error('Unauthorized'))
      }
      const apikey = await prismaClient.session.findUnique({
        where: {
          payload: token
        }
      })
      if (!apikey) {
        return notAuthorized(new Error('Unauthorized'))
      }

      return ok({
        apiKey: apikey.payload,
        userId: apikey.userId
      })
    } catch (error: Error | any) {
      return serverError(error as Error)
    }
  }
}
