import { ProductEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface GetAllEstablishmentProductsUseCase {
  getAllEstablishmentProducts: (
    establishmentId: string
  ) => Promise<GetAllEstablishmentProductsUseCase.Result>
}

export namespace GetAllEstablishmentProductsUseCase {
  export type Return = Array<Omit<ProductEntity, 'establishment'>>

  export type Result = Either<EstablishmentNotFoundError, Return>
}
