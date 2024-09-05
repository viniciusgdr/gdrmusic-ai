import { type PrismaClient } from '@prisma/client'
import { type LoadMusicsLatestRepository } from '../../../data/protocols/LoadMusicsLatestRepository'

export class LoadMusicsLatestPrismaRepository implements LoadMusicsLatestRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async load (params: LoadMusicsLatestRepository.Params): Promise<LoadMusicsLatestRepository.Result> {
    const musics = await this.prismaClient.music.findMany({
      take: params.limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        artist: true,
        album: true,
        createdAt: true,
        genre: true,
        updatedAt: true,
        year: true,
        thumbnail: true
      }
    })
    return musics
  }
}
