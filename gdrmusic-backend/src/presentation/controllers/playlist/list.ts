import { type PlaylistList } from '../../../domain/usecases/playlist-list'
import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../protocols'

export class PlaylistListController implements Controller {
  constructor (private readonly playlistList: PlaylistList) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body
      if (!userId) {
        return badRequest(new MissingParamError('userId'))
      }
      const musics = await this.playlistList.load({
        id: userId
      })
      return ok(musics)
    } catch (error: any) {
      return badRequest(error)
    }
  }
}
