import { SurveyEntity } from '@/data/entities'

export interface GetSurveyByIdRepository {
  getById: (
    surveyId: string,
    strategy?: GetSurveyByIdRepository.Strategy,
    withClose?: boolean
  ) => Promise<SurveyEntity>
}

export namespace GetSurveyByIdRepository {
  export type Strategy = {
    withEstablishment?: boolean
    withEstablishmentAndManager?: boolean
    withVotes?: boolean
    withMusics?: boolean
    withSurveyToMusic?: boolean
    withClosed?: boolean
  }
}
