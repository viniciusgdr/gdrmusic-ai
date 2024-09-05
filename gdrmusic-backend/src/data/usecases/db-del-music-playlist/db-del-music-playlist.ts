import { type DelMusicPlaylist } from '../../../domain/usecases/del-music-playlist'
import { type LoadUserByIdRepository } from '../../protocols/loadUserByid'
import { type LoadPlaylistRepository } from '../../protocols/loadPlaylistRepository'
import { type DelMusicPlaylistRepository } from '../../protocols/DelMusicPlaylistRepository'

export class DbDelMusicPlaylist implements DelMusicPlaylist {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadPlaylistRepository: LoadPlaylistRepository,
    private readonly delMusicPlaylistRepository: DelMusicPlaylistRepository
  ) { }

  async delMusic (params: DelMusicPlaylist.Params): Promise<DelMusicPlaylist.Result> {
    const user = await this.loadUserByIdRepository.load(params.userId)
    if (!user) {
      return false
    }
    const playlist = await this.loadPlaylistRepository.load(params.playlistId)
    if (!playlist) {
      return false
    }
    const music = playlist.musics.find(music => music.musicId === params.musicId)
    if (!music) {
      return false
    }
    const newMusic = await this.delMusicPlaylistRepository.delMusic({
      playlistId: params.playlistId,
      musicId: music.id,
      userId: params.userId
    })
    return newMusic
  }
}
