import { type Controller } from '../../presentation/protocols'
import { ValidateOwnerPlaylistPrismaRepository } from '../../infra/db/prisma/validate-owner-playlist'
import { DbValidateOwnerPlaylist } from '../../data/usecases/db-validate-owner-playlist/db-validate-owner-playlist'
import { ValidateOwnerPlaylistController } from '../../presentation/controllers/playlist/validate-id'
import { RedisCacheRepository } from '../../infra/db/redis/cacheRepository'
import { type PrismaClient } from '@prisma/client'
import { type RedisDefaultModules, type RedisFunctions, type RedisScripts, type RedisClientType } from 'redis'

export const makeValidateOwnerPlaylistController = (prismaClient: PrismaClient, redisClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>): Controller => {
  const validateOwnerPlaylistRepository = new ValidateOwnerPlaylistPrismaRepository(prismaClient)
  const cacheRepository = new RedisCacheRepository(redisClient)
  const validateOwnerPlaylist = new DbValidateOwnerPlaylist(validateOwnerPlaylistRepository, cacheRepository)
  return new ValidateOwnerPlaylistController(validateOwnerPlaylist)
}
