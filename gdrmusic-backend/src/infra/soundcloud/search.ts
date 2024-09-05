import { type SearchRepository } from '../../data/protocols/SearchRepository'
import Client from './soundcloud-module/Client'

export class SoundCloudSearchRepository implements SearchRepository {
  private readonly soundCloudClient: Client
  constructor () {
    this.soundCloudClient = new Client()
  }

  async search (search: SearchRepository.Params): Promise<SearchRepository.Result[]> {
    const result = await this.soundCloudClient.search(search.query, search.take, search.skip)
    return result
      .filter(r => r.artwork_url)
      .map(r => ({
        album: r.user.username || r.user.permalink || '',
        artist: r.user.username || r.user.permalink || '',
        genre: '',
        likes: BigInt(r.likes_count || 0),
        partnerId: r.permalink_url,
        thumbnail: r.artwork_url ?? '',
        title: r.title,
        year: new Date(r.created_at).getFullYear() || 0,
        partnerType: 'SOUNDCLOUD'
      }))
  }
}
