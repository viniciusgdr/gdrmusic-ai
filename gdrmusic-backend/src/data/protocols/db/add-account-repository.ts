import { type UserModel } from '../../domain/models/user'

export interface AddAccountRepository {
  add: (accountData: AddAccountRepository.Params) => Promise<UserModel>
}

export namespace AddAccountRepository {
  export interface Params {
    name: string
    email: string
    password: string
    accountMethod: 'EMAIL' | 'GOOGLE'
    userId: string
    image?: string
  }
}
