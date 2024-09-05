import { type PrismaClient } from '@prisma/client'
import { type LoadMusicByIdRepository } from '../../../data/protocols/LoadMusicByIdRepository'

export class LoadMusicByIdPrismaRepository implements LoadMusicByIdRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async load (params: LoadMusicByIdRepository.Params): Promise<LoadMusicByIdRepository.Result> {
    const music = await this.prismaClient.music.findUnique({
      where: {
        id: params.id
      }
    })
    return music
  }
}
