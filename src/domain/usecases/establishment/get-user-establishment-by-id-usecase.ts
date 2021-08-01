import { Either } from '@/shared/either'
import { EstablishmentEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'

export interface GetUserEstablishmentByIdUseCase {
  getUserEstablishmentById: (
    userId: string,
    establishmentId: string
  ) => Promise<GetUserEstablishmentByIdUseCase.Response>
}

export namespace GetUserEstablishmentByIdUseCase {
  export type Result = Omit<
    EstablishmentEntity,
    | 'manager'
    | 'products'
    | 'playlists'
    | 'accounts'
    | 'surveys'
    | 'musics'
    | 'deletedAt'
  >
  export type Response = Either<EstablishmentNotFoundError, Result>
}
