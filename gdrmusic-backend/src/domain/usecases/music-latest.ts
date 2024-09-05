import { type Music } from '../models/music'

export interface MusicLatest {
  load: () => Promise<MusicLatest.Result>
}
interface OmitValues {
  'partnerId': never
  'likesOnPartnerId': never
}
export namespace MusicLatest {
  export type Result = Array<Omit<Music, keyof OmitValues>>
}
