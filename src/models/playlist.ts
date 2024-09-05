import { PlaylistType } from '@prisma/client'
import { Music as MusicRelation } from './music'
export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail: string
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
    music: MusicRelation
  }
}
