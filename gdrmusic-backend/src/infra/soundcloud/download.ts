import { type LoadPlayerPairProcessDownloadRepository } from '../../data/protocols/LoadPlayerPairProcessDownloadRepository'
import Client from './soundcloud-module/Client'

export class SoundcloudDownloadRepository implements LoadPlayerPairProcessDownloadRepository {
  type = 'SOUNDCLOUD'
  private readonly soundCloudClient: Client
  constructor () {
    this.soundCloudClient = new Client()
  }

  async load (load: LoadPlayerPairProcessDownloadRepository.Params): Promise<LoadPlayerPairProcessDownloadRepository.Result> {
    const stream = await this.soundCloudClient.download(load.id)
    return {
      stream,
      size: Number(stream.headers['content-length'])
    }
  }
}
