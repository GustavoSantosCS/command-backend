import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import { makeCreateAccountController } from '@/main/factory/account';
import { authorization } from '../middleware';

export default (router: Router): void => {
  router.post(
    '/account',
    authorization,
    adapterRoute(makeCreateAccountController())
  );
};
