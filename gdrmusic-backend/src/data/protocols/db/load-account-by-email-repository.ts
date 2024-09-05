import { type UserModel } from '../../../domain/models/user'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<LoadAccountByEmailRepository.Result>
}

export namespace LoadAccountByEmailRepository {
  export type Result = UserModel | null
}
