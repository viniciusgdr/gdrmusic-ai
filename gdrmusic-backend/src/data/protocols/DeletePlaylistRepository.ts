import { type Playlist } from '../../domain/models/playlist'

export interface DeletePlaylistRepository {
  delete: (params: DeletePlaylistRepository.Params) => Promise<DeletePlaylistRepository.Result>
}

export namespace DeletePlaylistRepository {
  export interface Params {
    userId: string
    playlistId: string
  }

  export type Result = Playlist
}
