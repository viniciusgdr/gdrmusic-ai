export interface SaveSessionRepository {
  save: (params: SaveSessionRepository.Params) => Promise<void>
}

export namespace SaveSessionRepository {
  export interface Params {
    userId: string
    payload: string
  }
}
