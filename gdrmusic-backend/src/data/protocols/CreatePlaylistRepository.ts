import { type Playlist } from '../../domain/models/playlist'

export interface CreatePlaylistRepository {
  create: (params: CreatePlaylistRepository.Params) => Promise<CreatePlaylistRepository.Result>
}
interface PlaylistOmit {
  'id': never
  'createdAt': never
  'updatedAt': never
}
export namespace CreatePlaylistRepository {
  export type Params = Omit<Playlist, keyof PlaylistOmit>
  export type Result = Playlist
}
