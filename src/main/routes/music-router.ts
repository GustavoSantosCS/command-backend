import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'
import { authorization } from '@/main/middleware'
import {
  makeAddMusicController,
  makeGetAllEstablishmentMusicsController
} from '@/main/factory/music'
import { musicImageMulter } from '@/presentation/middleware'

export default (router: Router): void => {
  router.post(
    '/music',
    authorization,
    musicImageMulter,
    adapterRoute(makeAddMusicController())
  )

  router.get(
    '/establishment/:establishmentId/musics',
    authorization,
    adapterRoute(makeGetAllEstablishmentMusicsController())
  )
}
