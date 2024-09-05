import { DbMusicAlreadyOnDB } from '../../data/usecases/db-music-already-on-db/db-music-already-on-db'
import { type MusicAlreadyOnDB } from '../../domain/usecases/music-already-on-db'
import { CheckLocalPlayerPairProcessDownloadFSRepository } from '../../infra/archives/fs/check-local-player-pair-process-download'

export const makeMusicAlreadyOnDbUsecase = (): MusicAlreadyOnDB => {
  const checkLocalPlayerPairProcessDownloadRepository = new CheckLocalPlayerPairProcessDownloadFSRepository()
  const checkLocalPlayerPairProcessDownload = new DbMusicAlreadyOnDB(checkLocalPlayerPairProcessDownloadRepository)
  return checkLocalPlayerPairProcessDownload
}
