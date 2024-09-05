import { type PrismaClient } from '@prisma/client'
import { type CreatePlaylistRepository } from '../../../data/protocols/CreatePlaylistRepository'

export class CreatePlaylistPrismaRepository implements CreatePlaylistRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async create (params: CreatePlaylistRepository.Params): Promise<CreatePlaylistRepository.Result> {
    const playlist = await this.prismaClient.playlist.create({
      data: params
    })

    return playlist
  }
}
