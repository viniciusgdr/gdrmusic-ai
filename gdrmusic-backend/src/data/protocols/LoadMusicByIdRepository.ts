import { type Music } from '@prisma/client'

export interface LoadMusicByIdRepository {
  load: (load: LoadMusicByIdRepository.Params) => Promise<LoadMusicByIdRepository.Result>
}

export namespace LoadMusicByIdRepository {
  export interface Params {
    id: string
  }
  export type Result = Music | null
}
