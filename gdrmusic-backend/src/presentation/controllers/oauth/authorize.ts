import { type Authenticate } from '../../../domain/usecases/authenticate'
import { serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'

export class OAuthAuthorizeController implements Controller {
  constructor (
    private readonly authenticate: Authenticate
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { code, redirectUri } = httpRequest.query
      const result = await this.authenticate.auth({ code, redirectUri })
      return {
        statusCode: 200,
        body: result
      }
    } catch (error: Error | any) {
      console.log(error)
      return serverError(error)
    }
  }
}
