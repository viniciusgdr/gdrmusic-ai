import { type HttpResponse, type HttpRequest } from './http'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
