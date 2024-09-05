export interface SaveMusic {
  save: (music: SaveMusic.Params) => Promise<void>
}

export namespace SaveMusic {
  export interface Params {
    id: string
    buffer: Buffer
    PATH: string
  }
}
