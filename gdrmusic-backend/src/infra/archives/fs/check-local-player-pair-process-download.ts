import { type CheckLocalPlayerPairProcessDownloadRepository } from '../../../data/protocols/CheckLocalPlayerPairProcessDownloadRepository'
import fs from 'fs'

export class CheckLocalPlayerPairProcessDownloadFSRepository implements CheckLocalPlayerPairProcessDownloadRepository {
  async check (download: CheckLocalPlayerPairProcessDownloadRepository.Params): Promise<CheckLocalPlayerPairProcessDownloadRepository.Result> {
    const { id } = download
    const pathStr = download.PATH + `/${id}.mp3`
    const exists = fs.existsSync(pathStr)
    return exists
  }
}
