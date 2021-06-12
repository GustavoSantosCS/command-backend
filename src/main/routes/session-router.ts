import { Router } from 'express';
import { adapterRoute } from '../adapter/express';
import { makeCreateSessionController } from '../factory/session';

export default (router: Router): void => {
  router.post('/session', adapterRoute(makeCreateSessionController()));
};
