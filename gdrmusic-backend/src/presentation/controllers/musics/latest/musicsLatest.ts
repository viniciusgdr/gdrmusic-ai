import { type MusicLatest } from '../../../../domain/usecases/music-latest'
import { badRequest, ok } from '../../../helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../../protocols'

export class MusicsLatestController implements Controller {
  constructor (private readonly musicLatest: MusicLatest) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const musics = await this.musicLatest.load()
      return ok(musics)
    } catch (error: any) {
      return badRequest(error)
    }
  }
}
