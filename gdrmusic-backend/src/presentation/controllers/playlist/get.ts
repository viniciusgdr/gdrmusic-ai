import { type GetPlaylist } from '../../../domain/usecases/get-playlist'
import { MissingParamError } from '../../../presentation/errors'
import { badRequest, ok, serverError } from '../../../presentation/helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../../presentation/protocols'

export class GetPlaylistController implements Controller {
  constructor (
    private readonly getPlaylist: GetPlaylist
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = request.body
      if (!userId) {
        return badRequest(new MissingParamError('userId'))
      }
      const { id } = request.params
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }
      const playlist = await this.getPlaylist.getPlaylist({
        userId,
        playlistId: id
      })
      return ok(playlist)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
