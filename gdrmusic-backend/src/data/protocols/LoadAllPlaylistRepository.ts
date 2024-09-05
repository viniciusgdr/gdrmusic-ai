import { type Playlist } from '../../domain/models/playlist'

export interface LoadAllPlaylistRepository {
  loadAll: (params: LoadAllPlaylistRepository.Params) => Promise<LoadAllPlaylistRepository.Result>
}
interface PlaylistOmit {
  'userId': never
}
export namespace LoadAllPlaylistRepository {
  export interface Params {
    id: string
  }

  export type Result = Array<Omit<(Playlist & {
    musics: Playlist.Music[]
  }), keyof PlaylistOmit>>
}
