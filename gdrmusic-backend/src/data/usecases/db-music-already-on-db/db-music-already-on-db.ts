import { type MusicAlreadyOnDB } from '../../../domain/usecases/music-already-on-db'
import { type CheckLocalPlayerPairProcessDownloadRepository } from '../../protocols/CheckLocalPlayerPairProcessDownloadRepository'

export class DbMusicAlreadyOnDB implements MusicAlreadyOnDB {
  constructor (private readonly musicAlreadyOnDBRepository: CheckLocalPlayerPairProcessDownloadRepository) { }

  async check (id: string, PATH: string): Promise<boolean> {
    const musicExists = await this.musicAlreadyOnDBRepository.check({
      id,
      PATH
    })
    return musicExists
  }
}
