import { Router } from 'express';
import { adapterRoute } from '@/main/adapter/express';
import {
  makeAddSurveyController,
  makeGetAllEstablishmentSurveyController
} from '../factory/survey';
import { authorization } from '../middleware';

export default (router: Router): void => {
  router.post(
    '/survey',
    authorization,
    adapterRoute(makeAddSurveyController())
  );

  router.get(
    '/establishment/:establishmentId/surveys',
    authorization,
    adapterRoute(makeGetAllEstablishmentSurveyController())
  );
};
