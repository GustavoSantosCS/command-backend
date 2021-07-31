import { Router } from 'express'

import { productImageMulter } from '@/presentation/middleware'
import { adapterRoute } from '@/main/adapter/express'
import {
  makeAddProductController,
  makeGetAllEstablishmentProductsController,
  makerGetProductByIdController
} from '@/main/factory/product'
import { authorization } from '@/main/middleware'

export default (router: Router): void => {
  router.get(
    '/product/:id',
    authorization,
    adapterRoute(makerGetProductByIdController())
  )

  router.get(
    '/establishment/:id/products',
    authorization,
    adapterRoute(makeGetAllEstablishmentProductsController())
  )

  router.post(
    '/product',
    authorization,
    productImageMulter,
    adapterRoute(makeAddProductController())
  )
}
