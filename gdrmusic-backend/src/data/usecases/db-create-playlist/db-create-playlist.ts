import { type CreatePlaylist } from '../../../domain/usecases/create-playlist'
import { type CreatePlaylistRepository } from '../../protocols/CreatePlaylistRepository'
import { type LoadAllPlaylistRepository } from '../../protocols/LoadAllPlaylistRepository'
import { type LoadUserByIdRepository } from '../../protocols/loadUserByid'

export class DbCreatePlaylist implements CreatePlaylist {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadAllPlaylistRepository: LoadAllPlaylistRepository,
    private readonly createPlaylistRepository: CreatePlaylistRepository
  ) { }

  async create (params: CreatePlaylist.Params): Promise<CreatePlaylist.Result> {
    const user = await this.loadUserByIdRepository.load(params.userId)
    if (!user) {
      throw new Error('User not found')
    }
    const playlists = await this.loadAllPlaylistRepository.loadAll({
      id: params.userId
    })
    const playlist = await this.createPlaylistRepository.create({
      userId: params.userId,
      description: '',
      fixed: false,
      thumbnail: params.thumbnailUrl ?? '',
      title: params.title ?? `Minha playlist nº ${playlists.length + 1}`,
      type: 'PRIVATE',
      createdBy: 'USER'
    })

    return playlist
  }
}
