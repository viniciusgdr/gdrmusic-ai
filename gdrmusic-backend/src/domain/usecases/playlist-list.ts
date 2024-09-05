import { type Playlist } from '../models/playlist'

export interface PlaylistList {
  load: (params: PlaylistList.Params) => Promise<PlaylistList.Result>
}
interface PlaylistOmit {
  'userId': never
}
export namespace PlaylistList {
  export interface Params {
    id: string
  }

  export type Result = Array<Omit<(Playlist & {
    musics: Playlist.Music[]
  }), keyof PlaylistOmit>>
}
