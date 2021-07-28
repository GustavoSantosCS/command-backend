import { SurveyEntity } from '@/data/entities';
import {
  EstablishmentNotFoundError,
  MusicNotFoundError
} from '@/domain/errors';
import { Either } from '@/shared/either';

export interface AddSurveyUseCase {
  addSurvey(data: AddSurveyUseCase.Param): Promise<AddSurveyUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace AddSurveyUseCase {
  export interface Param {
    question: string;
    musics: { id: string }[];
    userId: string;
    establishmentId: string;
  }
  export type Return = Omit<SurveyEntity, 'establishment' | 'pollVotes'>;

  export type Result = Either<
    EstablishmentNotFoundError | MusicNotFoundError[],
    Return
  >;
}
