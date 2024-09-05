import { type LoadPlaylistRepository } from '../../../data/protocols/loadPlaylistRepository'
import { type GetPlaylist } from '../../../domain/usecases/get-playlist'

export class DbGetPlaylist implements GetPlaylist {
  constructor (
    private readonly loadPlaylistRepository: LoadPlaylistRepository
  ) {}

  async getPlaylist (params: GetPlaylist.Params): Promise<GetPlaylist.Result> {
    const playlist = await this.loadPlaylistRepository.load(params.playlistId)
    if (!playlist || (playlist.userId !== params.userId && playlist.type === 'PRIVATE')) {
      return null
    }
    return playlist
  }
}
