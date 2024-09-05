import { type Playlist } from '../models/playlist'

export interface DeletePlaylist {
  delete: (params: DeletePlaylist.Params) => Promise<DeletePlaylist.Result>
}

export namespace DeletePlaylist {
  export interface Params {
    userId: string
    playlistId: string
  }
  export type Result = Playlist
}
