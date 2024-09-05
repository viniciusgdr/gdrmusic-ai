import { type DeletePlaylist } from '../../../domain/usecases/delete-playlist'
import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../protocols'

export class DeletePlaylistController implements Controller {
  constructor (
    private readonly deletePlaylist: DeletePlaylist
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = request.body
      if (!userId) {
        return badRequest(new MissingParamError('userId'))
      }
      const requiredFields = ['playlistId']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const playlist = await this.deletePlaylist.delete({
        playlistId: request.body.playlistId,
        userId
      })

      return ok(playlist)
    } catch (error: any) {
      console.log(error)
      return serverError(error)
    }
  }
}
