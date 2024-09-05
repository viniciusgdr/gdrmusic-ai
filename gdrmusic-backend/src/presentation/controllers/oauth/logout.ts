import { prismaClient } from '../../../main/server'
import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../protocols'

export class LogoutController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { userId, apiKey } = httpRequest.additionalInfo

    if (!userId) {
      return badRequest(new MissingParamError('userId'))
    }

    // TODO: clean code
    await prismaClient.session.deleteMany({
      where: {
        userId,
        payload: apiKey
      }
    })

    return ok({ message: 'Logged out successfully' })
  }
}
