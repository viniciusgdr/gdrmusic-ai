import { type PlaylistList } from '../../../domain/usecases/playlist-list'
import { type LoadAllPlaylistRepository } from '../../protocols/LoadAllPlaylistRepository'

export class DbPlaylistList implements PlaylistList {
  constructor (
    private readonly playlistListRepository: LoadAllPlaylistRepository
  ) {}

  async load (params: PlaylistList.Params): Promise<PlaylistList.Result> {
    const playlist = await this.playlistListRepository.loadAll(params)
    return playlist
  }
}
