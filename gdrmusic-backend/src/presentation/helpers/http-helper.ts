import { type HttpResponse } from './../protocols'

export const badRequest = (error: Error | object): HttpResponse => ({
  statusCode: 400,
  body: {
    error: error instanceof Error ? error.message : error
  }
})

export const unsupportedMediaType = (error: Error): HttpResponse => ({
  statusCode: 415,
  body: {
    error: error.message
  }
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: {
    error: error.message
  }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: {
    error: error.message
  }
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const notAuthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: {
    error: error.message
  }
})
