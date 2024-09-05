import { type Music } from '../../domain/models/music'

export interface SaveSearchRepository {
  save: (search: SaveSearchRepository.Params[], query: string) => Promise<SaveSearchRepository.Result[]>
}

export namespace SaveSearchRepository {
  export interface Params {
    partnerId: string
    title: string
    artist: string
    album: string
    year: number
    thumbnail: string
    genre: string
    likes: bigint
    partnerType: 'YOUTUBE' | 'SOUNDCLOUD'
  }
  export type Result = Omit<Music, 'likesOnPartnerId'>
}
