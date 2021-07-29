import { SurveyEntity } from '@/data/entities';
import { SurveyNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface GetSurveyByIdUseCase {
  getSurveyById: (userId: string) => Promise<GetSurveyByIdUseCase.Result>;
}
// eslint-disable-next-line no-redeclare
export namespace GetSurveyByIdUseCase {
  export type Return = Omit<SurveyEntity, 'establishment'>;

  export type Result = Either<SurveyNotFoundError, Return>;
}
