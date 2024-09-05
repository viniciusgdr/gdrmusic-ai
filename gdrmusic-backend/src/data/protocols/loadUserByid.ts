import { type User } from '@prisma/client'

export interface LoadUserByIdRepository {
  load: (userId: LoadUserByIdRepository.Params) => Promise<LoadUserByIdRepository.Result>
}

export namespace LoadUserByIdRepository {
  export type Params = string
  export type Result = User | null
}
