export interface ValidateOwnerPlaylist {
  validate: (playlistId: string, userId: string) => Promise<boolean>
}

export namespace ValidateOwnerPlaylist {
  export interface Params {
    playlistId: string
    userId: string
  }
}
