import { type NextFunction, type Request, type Response } from 'express'
import { type HttpRequest, type Controller } from '../../presentation/protocols'
import { type Middleware } from '../../presentation/protocols/middleware'

type RequestWithAdditionalInfo = Request & {
  additionalInfo?: any
}

export const adaptRoute = (controller: Controller) => {
  return async (req: RequestWithAdditionalInfo, res: Response) => {
    if (!req.additionalInfo) req.additionalInfo = {}
    const httpRequest: HttpRequest = {
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
      additionalInfo: req.additionalInfo,
      _extra: {
        res
      }
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.stream) {
      return
    }

    if (typeof httpResponse.body === 'string') {
      res.status(httpResponse.statusCode).send(httpResponse.body)
      return
    }
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: RequestWithAdditionalInfo, res: Response, next: NextFunction) => {
    if (!req.additionalInfo) req.additionalInfo = {}
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req.additionalInfo, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
