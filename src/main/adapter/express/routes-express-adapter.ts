import { Request, Response } from 'express'
import { HttpRequest, Controller } from '@/presentation/protocols'

export const adapterRoute =
  (controller: Controller) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers
    }

    const httpResponse = await controller.handle(httpRequest)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line promise/param-names
      await new Promise(_ => setTimeout(_, 2500))
    }
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
