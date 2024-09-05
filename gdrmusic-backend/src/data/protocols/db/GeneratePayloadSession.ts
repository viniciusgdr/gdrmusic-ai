export interface GeneratePayloadSession {
  generate: (params: GeneratePayloadSession.Params) => Promise<GeneratePayloadSession.Result>
}

export namespace GeneratePayloadSession {
  export interface Params {
    userId: string
  }

  export interface Result {
    payload: string
  }
}
