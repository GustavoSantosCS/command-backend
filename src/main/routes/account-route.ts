import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'
import {
  makeCreateAccountController,
  makeGetAllUserAccountController
} from '@/main/factory/account'
import { authorization } from '@/main/middleware'

export default (router: Router): void => {
  router.post(
    '/account',
    authorization,
    adapterRoute(makeCreateAccountController())
  )

  router.get(
    '/user/accounts',
    authorization,
    adapterRoute(makeGetAllUserAccountController())
  )
}
