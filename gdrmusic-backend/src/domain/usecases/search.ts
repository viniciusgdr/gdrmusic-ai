import { type Music } from '../models/music'

export interface Search {
  search: (search: Search.Params) => Promise<Search.Result>
}

export namespace Search {
  export interface Params {
    query: string
    skip: number | null
    take: number | null
  }

  export type Result = Array<Omit<Music, 'likesOnPartnerId'>>
}
