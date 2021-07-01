import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import { authorization } from '@/main/middleware';
import {
  makeAddMusicController,
  makeGetAllEstablishedMusicsController
} from '@/main/factory/music';

export default (router: Router): void => {
  router.post('/music', authorization, adapterRoute(makeAddMusicController()));

  router.get(
    '/establishment/:id/musics',
    authorization,
    adapterRoute(makeGetAllEstablishedMusicsController())
  );
};
