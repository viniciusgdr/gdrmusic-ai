export interface DelMusicPlaylist {
  delMusic: (data: DelMusicPlaylist.Params) => Promise<DelMusicPlaylist.Result>
}

export namespace DelMusicPlaylist {
  export interface Params {
    playlistId: string
    musicId: string
    userId: string
  }

  export type Result = boolean
}
