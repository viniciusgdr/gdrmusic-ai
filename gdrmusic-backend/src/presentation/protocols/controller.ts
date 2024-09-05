import { type HttpResponse, type HttpRequest } from './http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
