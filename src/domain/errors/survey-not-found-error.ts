import { AppError } from '@/shared/errors'

export class SurveyNotFoundError extends AppError {
  constructor () {
    super('Enquete não encontrada')
    this.name = 'SurveyNotFoundError'
  }
}
