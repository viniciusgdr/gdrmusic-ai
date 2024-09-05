import { type MusicLatest } from '../../../domain/usecases/music-latest'
import { type LoadMusicsLatestRepository } from '../../protocols/LoadMusicsLatestRepository'

export class DbLoadMusicsLatest implements MusicLatest {
  constructor (private readonly loadMusicsLatestRepository: LoadMusicsLatestRepository) {}

  async load (): Promise<MusicLatest.Result> {
    const musics = await this.loadMusicsLatestRepository.load({
      limit: 75
    })
    return musics
  }
}
