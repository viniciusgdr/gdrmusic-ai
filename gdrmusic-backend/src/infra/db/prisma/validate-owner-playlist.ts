import { type PrismaClient } from '@prisma/client'
import { type ValidateOwnerPlaylistRepository } from '../../../data/protocols/ValidateOwnerPlaylistRepository'

export class ValidateOwnerPlaylistPrismaRepository implements ValidateOwnerPlaylistRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async validate (playlistId: string, userId: string): Promise<boolean> {
    const playlist = await this.prismaClient.playlist.findUnique({
      where: {
        id: playlistId
      }
    })
    if (!playlist) {
      return false
    }
    return playlist.userId === userId
  }
}
