import { type LoadPlaylistRepository } from '../../../data/protocols/loadPlaylistRepository'
import { type PrismaClient } from '@prisma/client'

export class LoadPlaylistPrismaRepository implements LoadPlaylistRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async load (id: string): Promise<LoadPlaylistRepository.Result> {
    const playlist = await this.prismaClient.playlist.findUnique({
      where: {
        id
      },
      include: {
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
      }
    })
    return playlist
  }
}
