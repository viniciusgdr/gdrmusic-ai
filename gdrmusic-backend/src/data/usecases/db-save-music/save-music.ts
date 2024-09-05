import { type SaveMusic } from '../../../domain/usecases/save-music'
import { type SaveLocalPlayerPairProcessDownloadRepository } from '../../protocols/SaveLocalPlayerPairProcessDownloadRepository'

export class DbSaveMusic implements SaveMusic {
  constructor (
    private readonly saveLocalPlayerPairProcessDownloadRepository: SaveLocalPlayerPairProcessDownloadRepository
  ) {}

  async save ({ PATH, buffer, id }: SaveMusic.Params): Promise<void> {
    await this.saveLocalPlayerPairProcessDownloadRepository.save({
      id,
      buffer,
      PATH
    })
  }
}
