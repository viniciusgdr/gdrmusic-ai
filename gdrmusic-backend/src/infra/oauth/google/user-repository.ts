import { type GetUserInfoRepository } from '../../../data/protocols/db/GetUserInfoRepository'

export class GoogleUserRepository implements GetUserInfoRepository {
  async load ({ code, redirectUri }: GetUserInfoRepository.Params): Promise<GetUserInfoRepository.Result> {
    try {
      const user = await this.getUserInfo(code)
      if (!user?.error) {
        return user
      }
      if (!redirectUri) {
        return null
      }
      const token = await this.getToken(code, redirectUri)
      const userInfo = await this.getUserInfo(token)
      return userInfo
    } catch (error) {
      console.log(error)
      return null
    }
  }

  private async getToken (code: string, redirectUri: string): Promise<string> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        client_id: process.env.CLIENT_ID_WEB_GOOGLE,
        client_secret: process.env.CLIENT_SECRET_GOOGLE,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })
    const json = await response.json()
    return json.access_token
  }

  private async getUserInfo (token: string): Promise<any> {
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const user = await response.json()
    return user
  }
}
