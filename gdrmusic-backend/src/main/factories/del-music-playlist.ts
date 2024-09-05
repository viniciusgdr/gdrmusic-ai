import { type PrismaClient } from '@prisma/client'
import { DbDelMusicPlaylist } from '../../data/usecases/db-del-music-playlist/db-del-music-playlist'
import { MusicPlaylistPrismaRepository } from '../../infra/db/prisma/add-music-playlist'
import { LoadPlaylistPrismaRepository } from '../../infra/db/prisma/load-playlist'
import { LoadUserByIdPrismaRepository } from '../../infra/db/prisma/load-user-by-id'
import { DelMusicPlaylistController } from '../../presentation/controllers/playlist/del-music'
import { type Controller } from '../../presentation/protocols'

export const makeDelMusicPlaylistRepository = (prismaClient: PrismaClient): Controller => {
  const loadUserByIdRepository = new LoadUserByIdPrismaRepository(prismaClient)
  const loadPlaylistRepository = new LoadPlaylistPrismaRepository(prismaClient)
  const addMusicPlaylistRepository = new MusicPlaylistPrismaRepository(prismaClient)
  const addMusicPlaylist = new DbDelMusicPlaylist(loadUserByIdRepository, loadPlaylistRepository, addMusicPlaylistRepository)
  const addMusicPlaylistController = new DelMusicPlaylistController(addMusicPlaylist)
  return addMusicPlaylistController
}
