import { RedisClientType, RedisDefaultModules, RedisFunctions, RedisScripts, } from 'redis';
import * as redis from 'redis';


export const RedisHelper = {
  client: null as unknown as RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>,
  async connect() {
    if (this.client) {
      return;
    }
    this.client = redis.createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
      name: process.env.REDIS_NAME,
      readonly: false
    });
    await this.client.connect();
    console.log('Redis connected')
  },
  async disconnect() {
    await this.client.disconnect();
    this.client = null!;
  }
}