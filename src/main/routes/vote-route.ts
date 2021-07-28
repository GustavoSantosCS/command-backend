import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import { makeAddVoteController } from '../factory/vote';
import { authorization } from '../middleware';

export default (router: Router): void => {
  router.post(
    '/survey/:surveyId/vote',
    authorization,
    adapterRoute(makeAddVoteController())
  );

  router.get(
    '/survey/:surveyId/user/vote',
    authorization,
    adapterRoute(makeGetUserVoteController())
  );
};
