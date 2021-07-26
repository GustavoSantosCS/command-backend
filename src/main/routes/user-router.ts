import { Router } from 'express';
import {
  makeAddUserController,
  makerAddAvatarController,
  makeUpdateUserController,
  makeGetAuthenticatedUserController
} from '@/main/factory/user';
import { avatarMulter } from '@/presentation/middleware';
import { adapterRoute } from '@/main/adapter/express';
import { authorization } from '@/main/middleware';
import { makeGetAllUserAccountController } from '../factory/account';

export default (router: Router): void => {
  router.post(
    '/avatar',
    authorization,
    avatarMulter,
    adapterRoute(makerAddAvatarController())
  );
  router.get(
    '/user/authenticated',
    authorization,
    adapterRoute(makeGetAuthenticatedUserController())
  );
  router.put('/user', authorization, adapterRoute(makeUpdateUserController()));
  router.post('/user', adapterRoute(makeAddUserController()));

  router.get(
    '/user/accounts',
    authorization,
    adapterRoute(makeGetAllUserAccountController())
  );
};
