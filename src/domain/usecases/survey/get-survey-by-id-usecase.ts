import { SurveyEntity } from '@/data/entities';
import { SurveyNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface GetSurveyByIdUseCase {
  getSurveyById: (
    data: GetSurveyByIdUseCase.Param
  ) => Promise<GetSurveyByIdUseCase.Result>;
}
// eslint-disable-next-line no-redeclare
export namespace GetSurveyByIdUseCase {
  export type Param = {
    userId: string;
    surveyId: string;
  };
  export type Return = Omit<SurveyEntity, 'establishment' | 'surveyToMusic'>; // TODO: remove isso quando votos

  export type Result = Either<SurveyNotFoundError, Return>;
}
