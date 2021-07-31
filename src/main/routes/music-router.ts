import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'
import { authorization } from '@/main/middleware'
import {
  makeAddMusicController,
  makeGetAllEstablishmentMusicsController
} from '@/main/factory/music'

export default (router: Router): void => {
  router.post('/music', authorization, adapterRoute(makeAddMusicController()))

  router.get(
    '/establishment/:establishmentId/musics',
    authorization,
    adapterRoute(makeGetAllEstablishmentMusicsController())
  )
}
