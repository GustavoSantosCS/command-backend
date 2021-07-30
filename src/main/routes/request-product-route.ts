import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import {
  makeCreateRequestProductController,
  makeGetAllRequestProductController
} from '@/main/factory/request-product';
import { authorization } from '../middleware';

export default (router: Router): void => {
  router.post(
    '/request/product',
    authorization,
    adapterRoute(makeCreateRequestProductController())
  );

  router.get(
    '/account/:accountId/request/product',
    authorization,
    adapterRoute(makeGetAllRequestProductController())
  );
};
