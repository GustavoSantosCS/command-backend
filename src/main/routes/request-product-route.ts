import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'
import {
  makeAddRequestProductController,
  makeGetAllRequestProductController
} from '@/main/factory/request-product'
import { authorization } from '../middleware'

export default (router: Router): void => {
  router.post(
    '/request/product',
    authorization,
    adapterRoute(makeAddRequestProductController())
  )

  router.get(
    '/account/:accountId/request/product',
    authorization,
    adapterRoute(makeGetAllRequestProductController())
  )
}
