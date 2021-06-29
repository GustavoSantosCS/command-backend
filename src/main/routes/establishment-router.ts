import { establishmentImageMulter } from '@/presentation/middleware';
import { Router } from 'express';
import { adapterRoute } from '../adapter/express';
import {
  makeAddEstablishmentController,
  makeGetAllUserEstablishmentController,
  makeGetUserEstablishmentByIdController
} from '../factory/establishment';
import { authorization } from '../middleware';

export default (router: Router): void => {
  router.post(
    '/establishment',
    authorization,
    establishmentImageMulter,
    adapterRoute(makeAddEstablishmentController())
  );

  router.get(
    '/user/establishment/:id',
    authorization,
    adapterRoute(makeGetUserEstablishmentByIdController())
  );

  router.get(
    '/user/establishment',
    authorization,
    adapterRoute(makeGetAllUserEstablishmentController())
  );
};
