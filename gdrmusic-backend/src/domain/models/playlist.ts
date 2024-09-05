import { type Music as MusicModel } from './music'

export type PlaylistType = 'PUBLIC' | 'PRIVATE'
export interface Playlist {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  userId: string
  type: PlaylistType
  fixed: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: 'SYSTEM' | 'USER'
}
export namespace Playlist {
  export interface Music {
    id: string
    playlistId: string
    musicId: string
    createdAt: Date
    updatedAt: Date
    music: Omit<MusicModel, 'likesOnPartnerId'>
  }
}
