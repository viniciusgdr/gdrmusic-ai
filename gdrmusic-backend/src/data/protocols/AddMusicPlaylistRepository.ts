import { type Playlist } from '../../domain/models/playlist'

export interface AddMusicPlaylistRepository {
  addMusic: (data: AddMusicPlaylistRepository.Params) => Promise<AddMusicPlaylistRepository.Result>
}

export namespace AddMusicPlaylistRepository {
  export interface Params {
    playlistId: string
    musicId: string
    userId: string
  }
  export type Result = Playlist.Music | null
}
