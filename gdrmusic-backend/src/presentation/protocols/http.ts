import { type Response } from 'express'

export interface HttpResponse {
  statusCode: number
  body: any
  stream?: boolean
  headers?: Record<string, string>
}
export interface HttpRequest {
  params?: any
  body?: any
  query?: any
  headers?: any
  additionalInfo?: any
  _extra?: {
    res: Response
  }
}
