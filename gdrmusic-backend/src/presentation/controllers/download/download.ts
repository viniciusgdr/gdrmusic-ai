import { type PlayerPairProcessDownload } from '../../../domain/usecases/player-pair-process-download'
import { makeSaveMusicUsecase } from '../../../main/factories/save-music'
import { MissingParamError } from '../../../presentation/errors'
import { badRequest } from '../../../presentation/helpers/http-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../../presentation/protocols'

export class DownloadMusicController implements Controller {
  constructor (
    private readonly pairProcessDownload: PlayerPairProcessDownload
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.params
    // const { action } = httpRequest.query
    if (typeof id !== 'string') {
      return badRequest(new MissingParamError('id'))
    }
    try {
      const download = await this.pairProcessDownload.download({
        id,
        PATH: process.env.PATH_MUSICS ?? '/tmp'
      })
      console.log('finished download', download.size)
      const headers: Record<string, string> = {
        'Content-Type': 'audio/mp3',
        'Content-Length': download.size.toString(),
        'Accept-Ranges': 'bytes',
        'Content-Disposition': `attachment; filename=${id}.mp3`
      }
      for (const [key, value] of Object.entries(headers)) {
        if (httpRequest._extra?.res) {
          httpRequest._extra.res.setHeader(key, value)
        }
      }
      const buffers: Buffer[] = []
      return await new Promise((resolve, reject) => {
        download.stream.pipe(httpRequest._extra?.res as any)
        download.stream.on('data', (data: any) => {
          buffers.push(data)
        })
        download.stream.on('end', (end: any) => {
          console.log('finished')
          void makeSaveMusicUsecase().save({
            id,
            buffer: Buffer.concat(buffers),
            PATH: process.env.PATH_MUSICS ?? ''
          })
          resolve({
            statusCode: 200,
            body: null,
            stream: true
          })
        })
        download.stream.on('error', reject)
      })
    } catch (error) {
      const e = error as Error
      console.error(error)
      return {
        statusCode: 500,
        body: {
          error: e.message
        },
        stream: false
      }
    }
  }
}
