import type fs from 'fs'
import type internal from 'stream'

export interface LoadPlayerPairProcessDownloadRepository {
  type: string
  load: (load: LoadPlayerPairProcessDownloadRepository.Params) => Promise<LoadPlayerPairProcessDownloadRepository.Result>
}

export namespace LoadPlayerPairProcessDownloadRepository {
  export interface Params {
    id: string
    PATH: string
  }
  export interface Result {
    stream: fs.ReadStream | internal.Readable | NodeJS.ReadableStream
    size: number
  }
}
