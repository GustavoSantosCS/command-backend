import { SurveyEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface GetAllEstablishmentSurveyUseCase {
  getAll: (
    establishmentId: string
  ) => Promise<GetAllEstablishmentSurveyUseCase.Response>
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentSurveyUseCase {
  export type Response = Either<
  EstablishmentNotFoundError,
  Array<Omit<SurveyEntity, 'establishment' | 'musics'>>
  >
}
