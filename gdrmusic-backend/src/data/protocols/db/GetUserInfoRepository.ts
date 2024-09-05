export interface GetUserInfoRepository {
  load: (params: GetUserInfoRepository.Params) => Promise<GetUserInfoRepository.Result>
}

export namespace GetUserInfoRepository {
  export interface Params {
    code: string
    redirectUri?: string
  }

  export type Result = {
    id: string
    email: string
    name: string
    picture: string
  } | null
}
