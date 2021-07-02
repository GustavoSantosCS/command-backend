import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';

import { authorization } from '../middleware';
import { makeAddPlaylistController } from '../factory/playlist';

export default (router: Router): void => {
  router.post(
    '/playlist',
    authorization,
    adapterRoute(makeAddPlaylistController())
  );
};
