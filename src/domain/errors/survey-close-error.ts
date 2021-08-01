import { SurveyEntity } from '@/data/entities'
import { AppError } from '@/shared/errors'

export class SurveyIsCloseError extends AppError {
  constructor(survey: SurveyEntity) {
    super('Esquete finalizada!', { surveyId: survey.id })
    this.name = 'SurveyIsCloseError'
  }
}
