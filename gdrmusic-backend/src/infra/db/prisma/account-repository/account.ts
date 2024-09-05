import { type PrismaClient } from '@prisma/client'
import { type LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { type UserModel } from '../../../../domain/models/user'
import { type SaveSessionRepository } from '../../../../data/protocols/db/GenerateSessionRepository'
import { type AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'

export class AccountPrismaRepository implements AddAccountRepository,
 LoadAccountByEmailRepository,
 SaveSessionRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async add (accountData: AddAccountRepository.Params): Promise<UserModel> {
    const { name, email, password, accountMethod, userId, image } = accountData
    const account = await this.prismaClient.user.create({
      data: {
        name,
        email,
        password,
        accountMethod,
        userId,
        imageUrl: image
      }
    })
    return {
      email,
      name,
      id: account.id,
      password: account.password,
      userId: account.userId,
      accountMethod: account.accountMethod
    }
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const account = await this.prismaClient.user.findUnique({
      where: {
        email
      }
    })
    if (!account) {
      return null
    }
    return {
      id: account.id,
      name: account.name,
      password: account.password,
      accountMethod: account.accountMethod,
      email: account.email,
      userId: account.userId
    }
  }

  async update (userId: string, name: string): Promise<void> {
    await this.prismaClient.user.update({
      where: {
        id: userId
      },
      data: {
        name
      }
    })
  }

  async save (params: SaveSessionRepository.Params): Promise<void> {
    const { userId, payload } = params
    await this.prismaClient.session.create({
      data: {
        userId,
        payload,
        lastActivity: new Date()
      }
    })
  }
}
