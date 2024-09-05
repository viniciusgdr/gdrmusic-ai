import { type Playlist } from '../../domain/models/playlist'

export interface LoadPlaylistRepository {
  load: (playlistId: string) => Promise<LoadPlaylistRepository.Result>
}

export namespace LoadPlaylistRepository {
  export type Result = (Playlist & {
    musics: Playlist.Music[]
  }) | null
}
