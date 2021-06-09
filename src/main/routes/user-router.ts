import { Router } from 'express';
import {
  makeAddUserController,
  makerAddAvatarController
} from '@/main/factory/user';
import { adapterMulter, adapterRoute } from '../adapter/express';

export default (router: Router): void => {
  router.post(
    '/user/avatar',
    adapterMulter('avatar'),
    adapterRoute(makerAddAvatarController())
  );
  router.post('/user', adapterRoute(makeAddUserController()));
};
