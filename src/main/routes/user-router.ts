import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express/routes';
import { makeAddUserController } from '@/main/factory/user';

export default (router: Router): void => {
  router.post('/user', adapterRoute(makeAddUserController()));
};
