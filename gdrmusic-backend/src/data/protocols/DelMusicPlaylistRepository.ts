export interface DelMusicPlaylistRepository {
  delMusic: (data: DelMusicPlaylistRepository.Params) => Promise<DelMusicPlaylistRepository.Result>
}

export namespace DelMusicPlaylistRepository {
  export interface Params {
    playlistId: string
    musicId: string
    userId: string
  }
  export type Result = boolean
}
