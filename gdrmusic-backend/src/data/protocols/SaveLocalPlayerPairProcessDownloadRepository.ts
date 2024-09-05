export interface SaveLocalPlayerPairProcessDownloadRepository {
  save: (save: SaveLocalPlayerPairProcessDownloadRepository.Params) => Promise<void>
}

export namespace SaveLocalPlayerPairProcessDownloadRepository {
  export interface Params {
    id: string
    buffer: Buffer
    PATH: string
  }
}
