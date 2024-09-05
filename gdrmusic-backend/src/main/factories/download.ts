import { LoadPlayerPairProcessDownload } from '../../data/usecases/load-player-pair-process-download/load-player-pair-process-download'
import { CheckLocalPlayerPairProcessDownloadFSRepository } from '../../infra/archives/fs/check-local-player-pair-process-download'
import { LoadPlayerPairProcessDownloadFSRepository } from '../../infra/archives/fs/load-player-pair-process-download'
import { LoadMusicByIdPrismaRepository } from '../../infra/db/prisma/load-music-by-id'
import { YoutubeDownloadRepository } from '../../infra/youtube/download'
import { SoundcloudDownloadRepository } from '../../infra/soundcloud/download'
import { type Controller } from '../../presentation/protocols'
import { DownloadMusicController } from '../../presentation/controllers/download/download'
import { PrismaClient } from '@prisma/client'
import { PlayerPairProcessDownload } from '../../domain/usecases/player-pair-process-download'

export const makeDownloadController = (prismaClient: PrismaClient): Controller => {
  const checkLocalPlayerPairProcessDownloadRepository = new CheckLocalPlayerPairProcessDownloadFSRepository()
  const loadLocalPlayerPairProcessDownloadRepository = new LoadPlayerPairProcessDownloadFSRepository()
  const loadMusicByIdRepository = new LoadMusicByIdPrismaRepository(prismaClient)

  const loadYoutubePlayerPairProcessDownloadRepository = new YoutubeDownloadRepository()
  const loadSoundcloudPlayerPairProcessDownloadRepository = new SoundcloudDownloadRepository()
  const playerPairProcess = new LoadPlayerPairProcessDownload(
    checkLocalPlayerPairProcessDownloadRepository,
    loadLocalPlayerPairProcessDownloadRepository,
    loadMusicByIdRepository,
    [
      loadYoutubePlayerPairProcessDownloadRepository,
      loadSoundcloudPlayerPairProcessDownloadRepository
    ]
  )

  return new DownloadMusicController(playerPairProcess)
}

export const makeDownloadUsecase = (prismaClient: PrismaClient): PlayerPairProcessDownload => {
  const checkLocalPlayerPairProcessDownloadRepository = new CheckLocalPlayerPairProcessDownloadFSRepository()
  const loadLocalPlayerPairProcessDownloadRepository = new LoadPlayerPairProcessDownloadFSRepository()
  const loadMusicByIdRepository = new LoadMusicByIdPrismaRepository(prismaClient)

  const loadYoutubePlayerPairProcessDownloadRepository = new YoutubeDownloadRepository()
  const loadSoundcloudPlayerPairProcessDownloadRepository = new SoundcloudDownloadRepository()
  return new LoadPlayerPairProcessDownload(
    checkLocalPlayerPairProcessDownloadRepository,
    loadLocalPlayerPairProcessDownloadRepository,
    loadMusicByIdRepository,
    [
      loadYoutubePlayerPairProcessDownloadRepository,
      loadSoundcloudPlayerPairProcessDownloadRepository
    ]
  )
}