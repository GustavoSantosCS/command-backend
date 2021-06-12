import { Router } from 'express';
import {
  makeAddUserController,
  makerAddAvatarController
} from '@/main/factory/user';
import { avatarMulter } from '@/presentation/middleware';
import { adapterRoute } from '../adapter/express';
import { authorization } from '../factory/user/middleware-authorization';

export default (router: Router): void => {
  router.post(
    '/user/avatar',
    authorization,
    avatarMulter,
    adapterRoute(makerAddAvatarController())
  );
  router.post('/user', adapterRoute(makeAddUserController()));
};
