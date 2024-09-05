import { type PrismaClient } from '@prisma/client'
import { DbDeletePlaylist } from '../../data/usecases/db-delete-playlist/db-delete-playlist'
import { DeletelePlaylistPrismaRepository } from '../../infra/db/prisma/delete-playlist-by-user-id'
import { DeletePlaylistController } from '../../presentation/controllers/playlist/delete'
import { type Controller } from '../../presentation/protocols'

export const makeDeletePlaylistController = (prismaClient: PrismaClient): Controller => {
  const deletePlaylistRepository = new DeletelePlaylistPrismaRepository(prismaClient)
  const deletePlaylist = new DbDeletePlaylist(deletePlaylistRepository)
  return new DeletePlaylistController(deletePlaylist)
}
