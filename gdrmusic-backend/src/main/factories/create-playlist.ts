import { DbCreatePlaylist } from '../../data/usecases/db-create-playlist/db-create-playlist'
import { CreatePlaylistPrismaRepository } from '../../infra/db/prisma/create-playlist-by-user-id'
import { CreatePlaylistController } from '../../presentation/controllers/playlist/create'
import { type Controller } from '../../presentation/protocols'
import { LoadUserByIdPrismaRepository } from '../../infra/db/prisma/load-user-by-id'
import { LoadAllPlaylistByUserIdPrismaRepository } from '../../infra/db/prisma/load-all-playlist-by-user-id'
import { type PrismaClient } from '@prisma/client'

export const makeCreatePlaylistController = (prismaClient: PrismaClient): Controller => {
  const createPlaylistRepository = new CreatePlaylistPrismaRepository(prismaClient)
  const loadUserByIdRepository = new LoadUserByIdPrismaRepository(prismaClient)
  const playlistListRepository = new LoadAllPlaylistByUserIdPrismaRepository(prismaClient)
  const createPlaylist = new DbCreatePlaylist(loadUserByIdRepository, playlistListRepository, createPlaylistRepository)
  return new CreatePlaylistController(createPlaylist)
}
