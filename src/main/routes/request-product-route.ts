import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import {
  makeCreateRequestProductController,
  makeGetAllRequestProductController
} from '@/main/factory/request-product';

export default (router: Router): void => {
  router.post(
    '/account/:accountId/request/product',
    adapterRoute(makeCreateRequestProductController())
  );

  router.get(
    '/account/:accountId/request/product',
    adapterRoute(makeGetAllRequestProductController())
  );
};
