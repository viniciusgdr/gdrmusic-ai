import { type RedisClientType, type RedisFunctions, type RedisModules, type RedisScripts } from 'redis'
import { type CacheRepository } from '../../../data/protocols/CacheRepository'

export class RedisCacheRepository implements CacheRepository {
  constructor (
    private readonly redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
  ) {}

  async get (key: string): Promise<string | null> {
    const content = await this.redisClient.get(key)
    return content
  }

  async set (key: string, value: string, expires?: number | undefined): Promise<void> {
    await this.redisClient.set(key, value)
    await this.redisClient.expire(key, expires ?? 30)
  }
}
