import { SurveyEntity } from '@/data/entities';
import { AppError } from '@/shared/errors';

export class ClientAlreadyVotedError extends AppError {
  constructor(survey: SurveyEntity) {
    super('Usuário ja votou nessa enquete');
    this.name = 'ClientAlreadyVotedError';
    this.data = { surveyId: survey.id };
  }
}
