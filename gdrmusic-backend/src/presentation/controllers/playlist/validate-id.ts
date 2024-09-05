import { badRequest, ok, serverError } from '../../../presentation/helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../../presentation/protocols'
import { MissingParamError } from '../../../presentation/errors'
import { type ValidateOwnerPlaylist } from '../../../domain/usecases/validate-owner-playlist'

export class ValidateOwnerPlaylistController implements Controller {
  constructor (private readonly validateOwnerPlaylist: ValidateOwnerPlaylist) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body
      if (!userId) {
        return badRequest(new MissingParamError('userId'))
      }
      const { playlistId } = httpRequest.body
      const requiredFields = ['playlistId']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = await this.validateOwnerPlaylist.validate(playlistId, userId)
      return ok({
        isValid
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
