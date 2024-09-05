import { type PlayerPairProcessDownload } from '../../../domain/usecases/player-pair-process-download'
import { type LoadPlayerPairProcessDownloadRepository } from '../../protocols/LoadPlayerPairProcessDownloadRepository'
import { type CheckLocalPlayerPairProcessDownloadRepository } from '../../protocols/CheckLocalPlayerPairProcessDownloadRepository'
import { type LoadMusicByIdRepository } from '../../protocols/LoadMusicByIdRepository'

export class LoadPlayerPairProcessDownload implements PlayerPairProcessDownload {
  constructor (
    private readonly checkLocalPlayerPairProcessDownloadRepository: CheckLocalPlayerPairProcessDownloadRepository,
    private readonly loadLocalPlayerPairProcessDownloadRepository: LoadPlayerPairProcessDownloadRepository,
    private readonly loadMusicByIdRepository: LoadMusicByIdRepository,
    private readonly loadPlayerPairProcessDownloadRepositories: LoadPlayerPairProcessDownloadRepository[]
  ) {}

  async download (download: PlayerPairProcessDownload.Params): Promise<PlayerPairProcessDownload.Result> {
    const music = await this.loadMusicByIdRepository.load({
      id: download.id
    })
    if (!music) {
      throw new Error('Music not found')
    }
    const exists = await this.checkLocalPlayerPairProcessDownloadRepository.check({
      id: download.id,
      PATH: download.PATH
    })
    if (exists) {
      const result = await this.loadLocalPlayerPairProcessDownloadRepository.load({
        id: download.id,
        PATH: download.PATH
      })
      return result
    }
    const repository = this.loadPlayerPairProcessDownloadRepositories.find(repository => repository.type === music.partnerType)
    if (!repository) {
      throw new Error('Repository not found')
    }
    const result = await repository.load({
      id: music.partnerId,
      PATH: download.PATH
    })
    return result
  }
}
