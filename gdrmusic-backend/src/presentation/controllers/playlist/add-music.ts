import { type AddMusicPlaylist } from '../../../domain/usecases/add-music-playlist'
import { MissingParamError } from '../../../presentation/errors'
import { badRequest, ok, serverError } from '../../../presentation/helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../../presentation/protocols'

export class AddMusicPlaylistController implements Controller {
  constructor (
    private readonly addMusicPlaylist: AddMusicPlaylist
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = request.body
      if (!userId) {
        return badRequest(new MissingParamError('userId'))
      }
      const { playlistId, musicId } = request.body
      const requiredFields = ['playlistId', 'musicId']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const music = await this.addMusicPlaylist.addMusic({
        playlistId,
        musicId,
        userId
      })
      return ok({
        music
      })
    } catch (error: any) {
      console.log(error)
      return serverError(error)
    }
  }
}
