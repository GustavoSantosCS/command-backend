import { establishmentImageMulter } from '@/presentation/middleware';
import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import {
  makeAddEstablishmentController,
  makeGetAllEstablishmentController,
  makeGetAllUserEstablishmentController,
  makeGetUserEstablishmentByIdController
} from '@/main/factory/establishment';
import { authorization } from '@/main/middleware';

export default (router: Router): void => {
  router.post(
    '/establishment',
    authorization,
    establishmentImageMulter,
    adapterRoute(makeAddEstablishmentController())
  );

  router.get(
    '/establishment/:id',
    authorization,
    adapterRoute(makeGetUserEstablishmentByIdController())
  );

  router.get(
    '/user/establishments',
    authorization,
    adapterRoute(makeGetAllUserEstablishmentController())
  );

  router.get(
    '/establishments',
    adapterRoute(makeGetAllEstablishmentController())
  );
};
