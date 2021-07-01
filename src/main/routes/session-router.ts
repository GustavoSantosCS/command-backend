import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import { makeCreateSessionController } from '@/main/factory/session';

export default (router: Router): void => {
  router.post('/session', adapterRoute(makeCreateSessionController()));
};
