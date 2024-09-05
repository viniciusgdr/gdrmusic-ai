import type fs from 'fs'
import type internal from 'stream'

export interface PlayerPairProcessDownload {
  download: (download: PlayerPairProcessDownload.Params) => Promise<PlayerPairProcessDownload.Result>
}

export namespace PlayerPairProcessDownload {
  export interface Params {
    id: string
    PATH: string
  }
  export interface Result {
    stream: fs.ReadStream | internal.Readable | NodeJS.ReadableStream
    size: number
  }
}
