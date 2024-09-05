import { type PrismaClient } from '@prisma/client'
import { type DeletePlaylistRepository } from '../../../data/protocols/DeletePlaylistRepository'

export class DeletelePlaylistPrismaRepository implements DeletePlaylistRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async delete (params: DeletePlaylistRepository.Params): Promise<DeletePlaylistRepository.Result> {
    await this.prismaClient.playlistMusic.deleteMany({
      where: {
        playlistId: params.playlistId,
        playlist: {
          userId: params.userId
        }
      }
    })
    const playlist = await this.prismaClient.playlist.delete({
      where: {
        id: params.playlistId,
        userId: params.userId
      }
    })

    return playlist
  }
}
