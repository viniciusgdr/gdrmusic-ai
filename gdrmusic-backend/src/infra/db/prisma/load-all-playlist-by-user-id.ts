import { type PrismaClient } from '@prisma/client'
import { type LoadAllPlaylistRepository } from '../../../data/protocols/LoadAllPlaylistRepository'

export class LoadAllPlaylistByUserIdPrismaRepository implements LoadAllPlaylistRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async loadAll (params: LoadAllPlaylistRepository.Params): Promise<LoadAllPlaylistRepository.Result> {
    const playlist = await this.prismaClient.playlist.findMany({
      where: {
        userId: params.id
      },
      select: {
        thumbnail: true,
        description: true,
        title: true,
        type: true,
        updatedAt: true,
        createdAt: true,
        id: true,
        fixed: true,
        createdBy: true,
        musics: {
          include: {
            music: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                createdAt: true,
                updatedAt: true,
                album: true,
                artist: true,
                genre: true,
                year: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return playlist
  }
}
