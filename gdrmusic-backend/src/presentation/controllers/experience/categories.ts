import { Genre } from '@prisma/client'
import { prismaClient } from '../../../main/server'
import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { type HttpRequest, type Controller, type HttpResponse } from '../../protocols'

export class ExperienceCategoriesController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { userId } = httpRequest.additionalInfo
    const { categories } = httpRequest.body as { categories: string[] }

    if (!userId) {
      return badRequest(new MissingParamError('userId'))
    }
    if (!categories) {
      return badRequest(new MissingParamError('categories'))
    }
    if (!Array.isArray(categories)) {
      return badRequest(new MissingParamError('categories'))
    }
    // check if categories are valid
    if (!categories.every(category => Object.values(Genre).includes(category as Genre))) {
      return badRequest(new MissingParamError('categories'))
    }

    // TODO: clean code
    await prismaClient.user.update({
      where: {
        id: userId
      },
      data: {
        genresLiked: {
          set: categories as Genre[]
        }
      }
    })

    return ok({ message: 'Categories updated successfully' })
  }
}
