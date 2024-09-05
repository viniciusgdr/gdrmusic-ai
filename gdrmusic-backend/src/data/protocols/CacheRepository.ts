export interface CacheRepository {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, expires?: number) => Promise<void>
}
