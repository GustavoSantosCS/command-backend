import { SurveyEntity } from '@/data/entities'
import { AppError } from '@/shared/errors'

export class SurveyIsCloseError extends AppError {
  constructor (survey: SurveyEntity) {
    super('Esquete finalizada!')
    this.name = 'SurveyIsCloseError'
    this.data = { surveyId: survey.id }
  }
}
