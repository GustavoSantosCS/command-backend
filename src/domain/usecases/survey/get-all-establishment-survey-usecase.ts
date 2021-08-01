import { SurveyEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface GetAllEstablishmentSurveyUseCase {
  getAll: (
    establishmentId: string
  ) => Promise<GetAllEstablishmentSurveyUseCase.Response>
}

export namespace GetAllEstablishmentSurveyUseCase {
  export type Response = Either<
    EstablishmentNotFoundError,
    Array<Omit<SurveyEntity, 'establishment' | 'musics'>>
  >
}
