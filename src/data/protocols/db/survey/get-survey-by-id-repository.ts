import { SurveyEntity } from '@/data/entities';

export interface GetSurveyByIdRepository {
  getById(
    surveyId: string,
    strategy?: GetSurveyByIdRepository.Strategy,
    includeClose?: boolean
  ): Promise<SurveyEntity>;
}

// eslint-disable-next-line no-redeclare
export namespace GetSurveyByIdRepository {
  export type Strategy = {
    includeEstablishment?: boolean;
    includeEstablishmentAndManager?: boolean;
    includeVotes?: boolean;
    includeMusics?: boolean;
    includeSurveyToMusic?: boolean;
  };
}
