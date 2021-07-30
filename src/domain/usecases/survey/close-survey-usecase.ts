import { SurveyEntity } from '@/data/entities';
import { SurveyNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface CloseSurveyUseCase {
  close(surveyId: string, userId: string): Promise<CloseSurveyUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace CloseSurveyUseCase {
  export type Return = Omit<SurveyEntity, 'establishment'>;

  export type Result = Either<SurveyNotFoundError, Return>;
}
