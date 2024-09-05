import { type AddMusicPlaylist } from '../../../domain/usecases/add-music-playlist'
import { type LoadUserByIdRepository } from '../../protocols/loadUserByid'
import { type LoadPlaylistRepository } from '../../../data/protocols/loadPlaylistRepository'
import { type AddMusicPlaylistRepository } from '../../../data/protocols/AddMusicPlaylistRepository'

export class DbAddMusicPlaylist implements AddMusicPlaylist {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadPlaylistRepository: LoadPlaylistRepository,
    private readonly addMusicPlaylistRepository: AddMusicPlaylistRepository
  ) { }

  async addMusic (params: AddMusicPlaylist.Params): Promise<AddMusicPlaylist.Result> {
    const user = await this.loadUserByIdRepository.load(params.userId)
    if (!user) {
      return null
    }
    const playlist = await this.loadPlaylistRepository.load(params.playlistId)
    if (!playlist) {
      return null
    }
    const music = playlist.musics.find(music => music.id === params.musicId)
    if (music) {
      return null
    }
    const newMusic = await this.addMusicPlaylistRepository.addMusic(params)
    return newMusic
  }
}
