import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';

import { authorization } from '../middleware';
import {
  makeAddPlaylistController,
  makeGetCurrentEstablishedPlaylistController
} from '../factory/playlist';

export default (router: Router): void => {
  router.post(
    '/playlist',
    authorization,
    adapterRoute(makeAddPlaylistController())
  );

  router.get(
    '/establishment/:establishmentId/playlists',
    authorization,
    adapterRoute(makeGetCurrentEstablishedPlaylistController())
  );
};
