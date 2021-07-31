import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'

import { authorization } from '../middleware'
import {
  makeAddPlaylistController,
  makeUpdatePlaylistController,
  makeGetCurrentEstablishmentPlaylistController,
  makeUpdateMusicsOfPlaylistController,
  makeNextMusicPlaylistController,
  makePreviousMusicPlaylistController,
  makeStartMusicPlaylistController,
  makeStopMusicPlaylistController
} from '../factory/playlist'

export default (router: Router): void => {
  router.post(
    '/playlist',
    authorization,
    adapterRoute(makeAddPlaylistController())
  )

  router.get(
    '/establishment/:establishmentId/playlists',
    authorization,
    adapterRoute(makeGetCurrentEstablishmentPlaylistController())
  )

  router.put(
    '/playlists',
    authorization,
    adapterRoute(makeUpdatePlaylistController())
  )

  router.put(
    '/playlists/musics',
    authorization,
    adapterRoute(makeUpdateMusicsOfPlaylistController())
  )

  router.put(
    '/playlists/:playlistId/next',
    authorization,
    adapterRoute(makeNextMusicPlaylistController())
  )

  router.put(
    '/playlists/:playlistId/previous',
    authorization,
    adapterRoute(makePreviousMusicPlaylistController())
  )

  router.put(
    '/playlists/:playlistId/start',
    authorization,
    adapterRoute(makeStartMusicPlaylistController())
  )

  router.put(
    '/playlists/:playlistId/stop',
    authorization,
    adapterRoute(makeStopMusicPlaylistController())
  )
}
