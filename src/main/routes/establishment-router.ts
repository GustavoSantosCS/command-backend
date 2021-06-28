import { establishmentImageMulter } from '@/presentation/middleware';
import { Router } from 'express';
import { adapterRoute } from '../adapter/express';
import {
  makeAddEstablishmentController,
  makeGetAllUserEstablishmentController
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
    '/user/establishment',
    authorization,
    adapterRoute(makeGetAllUserEstablishmentController())
  );
};
