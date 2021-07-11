import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import { makeCreateRequestProductController } from '@/main/factory/request-product';

export default (router: Router): void => {
  router.post(
    '/account/:idAccount/request/product',
    adapterRoute(makeCreateRequestProductController())
  );
};
