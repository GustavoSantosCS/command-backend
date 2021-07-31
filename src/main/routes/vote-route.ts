import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'
import { makeAddVoteController } from '../factory/vote'
import { authorization } from '../middleware'

export default (router: Router): void => {
  router.post('/votes', authorization, adapterRoute(makeAddVoteController()))
}
