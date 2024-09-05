import { type PrismaClient } from '@prisma/client'
import { type LoadUserByIdRepository } from '../../../data/protocols/loadUserByid'

export class LoadUserByIdPrismaRepository implements LoadUserByIdRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async load (userId: LoadUserByIdRepository.Params): Promise<LoadUserByIdRepository.Result> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        id: userId
      }
    })

    return user
  }
}
