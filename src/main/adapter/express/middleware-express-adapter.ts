import { HttpRequest, Middleware } from '@/presentation/protocols'

import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware =
  (middleware: Middleware) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
      }

      const middlewareReturn = await middleware.handle(httpRequest)

      if (middlewareReturn.statusCode === 200) {
        Object.assign(req.body, middlewareReturn.body)
        next()
      } else {
        res.status(middlewareReturn.statusCode).json(middlewareReturn.body)
      }
    }
