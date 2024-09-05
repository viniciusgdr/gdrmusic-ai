export interface SearchRepository {
  search: (search: SearchRepository.Params) => Promise<SearchRepository.Result[]>
}

export namespace SearchRepository {
  export interface Params {
    query: string
    take: number
    skip: number
  }

  export interface Result {
    partnerType: 'YOUTUBE' | 'SOUNDCLOUD'
    partnerId: string
    title: string
    artist: string
    album: string
    year: number
    thumbnail: string
    genre: string
    likes: bigint
  }
}
