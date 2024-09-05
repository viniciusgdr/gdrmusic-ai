import { type Search } from '../../../domain/usecases/search'
import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../protocols'

export class SearchController implements Controller {
  constructor (private readonly search: Search) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { query, skip, take } = httpRequest.query
    if (!query) {
      return badRequest(new MissingParamError('query'))
    }
    const result = await this.search.search({
      query: decodeURIComponent(query),
      skip: skip || null,
      take: take || 20
    })
    return ok(result)
  }
}
