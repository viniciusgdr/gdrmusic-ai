import { type LoadPlayerPairProcessDownloadRepository } from '../../../data/protocols/LoadPlayerPairProcessDownloadRepository'
import fs from 'fs'
export class LoadPlayerPairProcessDownloadFSRepository implements LoadPlayerPairProcessDownloadRepository {
  type = 'FS'

  async load (download: LoadPlayerPairProcessDownloadRepository.Params): Promise<LoadPlayerPairProcessDownloadRepository.Result> {
    const { id } = download
    const pathStr = download.PATH + `/${id}.mp3`
    const exists = fs.statSync(pathStr)
    console.log('loaded')
    if (exists.isFile()) {
      const stream = fs.createReadStream(pathStr)
      return {
        stream,
        size: exists.size
      }
    }
    throw new Error('File not found')
  }
}
