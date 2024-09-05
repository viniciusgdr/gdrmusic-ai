import { type CacheRepository } from '../../../data/protocols/CacheRepository'
import { type ValidateOwnerPlaylistRepository } from '../../../data/protocols/ValidateOwnerPlaylistRepository'
import { type ValidateOwnerPlaylist } from '../../../domain/usecases/validate-owner-playlist'

export class DbValidateOwnerPlaylist implements ValidateOwnerPlaylist {
  constructor (
    private readonly validateOwnerPlaylistRepository: ValidateOwnerPlaylistRepository,
    private readonly cacheRepository: CacheRepository
  ) {}

  async validate (playlistId: string, userId: string): Promise<boolean> {
    const cacheKey = `playlist-owner:${playlistId}-${userId}`
    const cached = await this.cacheRepository.get(cacheKey)
    if (cached) {
      return JSON.parse(cached).isValid
    }
    const isValid = await this.validateOwnerPlaylistRepository.validate(playlistId, userId)
    await this.cacheRepository.set(cacheKey, JSON.stringify({
      isValid
    }))
    return isValid
  }
}
