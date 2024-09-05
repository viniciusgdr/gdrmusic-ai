import { type Music } from '../../domain/models/music'

export interface LoadMusicsLatestRepository {
  load: (params: LoadMusicsLatestRepository.Params) => Promise<LoadMusicsLatestRepository.Result>
}

interface OmitValues {
  'partnerId': never
  'likesOnPartnerId': never
}
export namespace LoadMusicsLatestRepository {
  export interface Params {
    limit: number
  }
  export type Result = Array<Omit<Music, keyof OmitValues>>
}
