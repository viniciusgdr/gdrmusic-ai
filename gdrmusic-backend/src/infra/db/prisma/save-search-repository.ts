import { Genre, type PrismaClient } from '@prisma/client'
import { type SaveSearchRepository } from '../../../data/protocols/SaveSearchRepository'

export class SaveSearchPrismaRepository implements SaveSearchRepository {
  constructor (
    private readonly prismaClient: PrismaClient
  ) { }

  async save (search: SaveSearchRepository.Params[], query: string): Promise<SaveSearchRepository.Result[]> {
    const musicsOnDB = await this.prismaClient.music.findMany()
    const results: Array<SaveSearchRepository.Result & {
      likesOnPartnerId: bigint
    }> = []
    const searchRefatored = search.map((music) => {
      const genre = Genre[music.genre as keyof typeof Genre] ? music.genre as keyof typeof Genre : 'OUTROS'
      return {
        partnerId: music.partnerId,
        title: music.title,
        artist: music.artist,
        album: music.album,
        year: music.year,
        genre,
        thumbnail: music.thumbnail,
        likesOnPartnerId: music.likes,
        partnerType: music.partnerType
      }
    }).filter((music) => !musicsOnDB.find((musicOnDB) => musicOnDB.partnerId === music.partnerId))

    for (const result of searchRefatored) {
      const musics = await this.prismaClient.music.create({
        data: result
      })
      results.push(
        {
          title: musics.title,
          artist: musics.artist,
          album: musics.album,
          year: musics.year,
          genre: musics.genre,
          createdAt: musics.createdAt,
          id: musics.id,
          updatedAt: musics.updatedAt,
          thumbnail: musics.thumbnail,
          likesOnPartnerId: musics.likesOnPartnerId
        }
      )
    }
    const resultsAlreadyInDB = search.filter((music) => musicsOnDB.find((musicOnDB) => musicOnDB.partnerId === music.partnerId))
    for (const result of resultsAlreadyInDB) {
      const dbContent = musicsOnDB.find((musicOnDB) => musicOnDB.partnerId === result.partnerId)
      if (!dbContent) {
        continue
      }
      results.push(
        {
          title: dbContent.title,
          artist: dbContent.artist,
          album: dbContent.album,
          year: dbContent.year,
          genre: dbContent.genre,
          createdAt: dbContent.createdAt,
          id: dbContent.id,
          updatedAt: dbContent.updatedAt,
          thumbnail: dbContent.thumbnail,
          likesOnPartnerId: dbContent.likesOnPartnerId
        }
      )
    }
    const resultsMatchesWithQuery = results.filter((music) => {
      const titleSplited = music.title.split(' ')
      const querySplited = query.split(' ')
      const matches = titleSplited.filter((word) => querySplited.includes(word))
      return matches.length > 0
    })
    results.push(...resultsMatchesWithQuery)
    const resultFinal: SaveSearchRepository.Result[] = results.sort((a, b) => {
      if (a.likesOnPartnerId > b.likesOnPartnerId) {
        return -1
      }
      if (a.likesOnPartnerId < b.likesOnPartnerId) {
        return 1
      }
      return 0
    }).map(item => {
      const { likesOnPartnerId, ...rest } = item
      return rest
    })

    return resultFinal
  }
}
