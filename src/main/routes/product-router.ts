import { productImageMulter } from '@/presentation/middleware';
import { Router } from 'express';
import { adapterRoute } from '../adapter/express';
import { makeAddProductController } from '../factory/product';
import { authorization } from '../middleware';

export default (router: Router): void => {
  router.post(
    '/product',
    authorization,
    productImageMulter,
    adapterRoute(makeAddProductController())
  );
};
