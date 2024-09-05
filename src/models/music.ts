import { Genre } from '@prisma/client'

export interface Music {
  id: string
  title: string
  artist: string
  album: string
  year: number
  thumbnail: string
  genre: Genre
}

export interface Queue extends Music {
  // if the music is the current music playing
  active: boolean
  // an unique id to identify the music in the queue
  _id: string
  // the id of the playlist that the music belongs
  playlistId?: string
}