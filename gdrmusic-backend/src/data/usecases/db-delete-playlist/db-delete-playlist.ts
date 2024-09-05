import { type DeletePlaylistRepository } from '../../../data/protocols/DeletePlaylistRepository'
import { type DeletePlaylist } from '../../../domain/usecases/delete-playlist'

export class DbDeletePlaylist implements DeletePlaylist {
  constructor (
    private readonly deletePlaylistRepository: DeletePlaylistRepository
  ) { }

  async delete (params: DeletePlaylist.Params): Promise<DeletePlaylist.Result> {
    const playlist = await this.deletePlaylistRepository.delete(params)
    return playlist
  }
}
