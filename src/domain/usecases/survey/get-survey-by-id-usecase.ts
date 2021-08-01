import { SurveyEntity } from '@/data/entities'
import { SurveyNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface GetSurveyByIdUseCase {
  getById: (userId: string) => Promise<GetSurveyByIdUseCase.Result>
}

export namespace GetSurveyByIdUseCase {
  export type Return = Omit<SurveyEntity, 'establishment'>

  export type Result = Either<SurveyNotFoundError, Return>
}
