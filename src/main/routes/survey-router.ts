import { Router } from 'express'
import { adapterRoute } from '@/main/adapter/express'
import {
  makeAddSurveyController,
  makeGetAllEstablishmentSurveyController,
  makeCloseSurveyController,
  makeGetSurveyByIdController
} from '../factory/survey'
import { authorization } from '../middleware'

export default (router: Router): void => {
  router.post(
    '/surveys',
    authorization,
    adapterRoute(makeAddSurveyController())
  )

  router.delete(
    '/surveys/:surveyId',
    authorization,
    adapterRoute(makeCloseSurveyController())
  )

  router.get(
    '/establishment/:establishmentId/surveys',
    authorization,
    adapterRoute(makeGetAllEstablishmentSurveyController())
  )

  router.get(
    '/surveys/:surveyId',
    authorization,
    adapterRoute(makeGetSurveyByIdController())
  )
}
