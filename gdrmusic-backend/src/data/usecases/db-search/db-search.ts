import { type Search } from '../../../domain/usecases/search'
import { type CacheRepository } from '../../protocols/CacheRepository'
import { type SaveSearchRepository } from '../../protocols/SaveSearchRepository'
import { type SearchRepository } from '../../protocols/SearchRepository'

export class DbSearch implements Search {
  constructor (
    private readonly cacheRepository: CacheRepository,
    private readonly searchRepositories: SearchRepository[],
    private readonly saveSearchRepository: SaveSearchRepository
  ) {}

  async search (search: Search.Params): Promise<Search.Result> {
    const { query, take, skip } = search
    const cache = await this.cacheRepository.get(`search:${query.trim()}:${skip ?? 0}:${take ?? 20}`)
    if (cache) {
      return JSON.parse(cache)
    }
    const result: SearchRepository.Result[] = []
    await Promise.allSettled(this.searchRepositories.map(async (repository) => {
      const repositoryResult = await repository.search({
        query: query.trim(),
        take: take ?? 50,
        skip: skip ?? 0
      })
      result.push(...repositoryResult)
    }))
    let savedContents = await this.saveSearchRepository.save(result, query)
    // sort by title matches
    savedContents = savedContents.sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      const aQuery = query.toLowerCase()
      const bQuery = query.toLowerCase()
      try {
        const aTitleMatches = aTitle.match(new RegExp(aQuery, 'g'))?.length ?? 0
        const bTitleMatches = bTitle.match(new RegExp(bQuery, 'g'))?.length ?? 0
        return bTitleMatches - aTitleMatches
      } catch (error) {
        // maybe regex error
        if (aTitle.includes(aQuery)) {
          return -1
        } else if (bTitle.includes(bQuery)) {
          return 1
        }
        return 0
      }
    })
    savedContents = savedContents.filter((item, index, self) => self.findIndex((i) => i.id === item.id) === index)
    if (savedContents.length > 0) {
      await this.cacheRepository.set(`search:${query}:${skip ?? 0}:${take ?? 20}`, JSON.stringify(savedContents), 60 * 60 * 24)
    }
    return savedContents
  }
}
