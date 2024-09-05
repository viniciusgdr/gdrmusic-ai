import { type SaveMusic } from '../../domain/usecases/save-music'
import { DbSaveMusic } from '../../data/usecases/db-save-music/save-music'
import { SaveLocalPlayerPairProcessDownloadFSRepository } from '../../infra/archives/fs/save-local-player-pair-process-download'

export const makeSaveMusicUsecase = (): SaveMusic => {
  const saveLocalPlayerPairProcessDownloadRepository = new SaveLocalPlayerPairProcessDownloadFSRepository()
  return new DbSaveMusic(saveLocalPlayerPairProcessDownloadRepository)
}
