export interface Authenticate {
  auth: (params: Authenticate.Params) => Promise<Authenticate.Result>
}

export namespace Authenticate {
  export interface Params {
    code: string
    redirectUri?: string
  }

  export interface Result {
    jwt: string
    isFirstLogin: boolean
  }
}
