import { Router } from 'express';
import {
  makeAddUserController,
  makerAddAvatarController,
  makeUpdateUserController
} from '@/main/factory/user';
import { avatarMulter } from '@/presentation/middleware';
import { adapterRoute } from '@/main/adapter/express';
import { authorization } from '@/main/middleware';

export default (router: Router): void => {
  router.post(
    '/user/avatar',
    authorization,
    avatarMulter,
    adapterRoute(makerAddAvatarController())
  );

  router.put('/user', authorization, adapterRoute(makeUpdateUserController()));
  router.post('/user', adapterRoute(makeAddUserController()));
};
