import { Router } from 'express';
import {
  makeAddUserController,
  makerAddAvatarController,
  makeUpdateUserController
} from '@/main/factory/user';
import { avatarMulter } from '@/presentation/middleware';
import { adapterRoute } from '@/main/adapter/express';
import { authorization } from '@/main/middleware';
import { makeRevalidateUserController } from '@/main/factory/user/revalidate-user.factory';

export default (router: Router): void => {
  router.post(
    '/avatar',
    authorization,
    avatarMulter,
    adapterRoute(makerAddAvatarController())
  );
  router.post(
    '/user/revalidate',
    authorization,
    adapterRoute(makeRevalidateUserController())
  );
  router.put('/user', authorization, adapterRoute(makeUpdateUserController()));
  router.post('/user', adapterRoute(makeAddUserController()));
};
