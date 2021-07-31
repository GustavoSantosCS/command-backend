import { ProductEntity } from '@/data/entities'
import { ProductNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface GetProductByIdUseCase {
  getById: (productId: string) => Promise<GetProductByIdUseCase.Result>
}

// eslint-disable-next-line no-redeclare
export namespace GetProductByIdUseCase {
  export type Return = Omit<ProductEntity, 'establishment'>
  export type Result = Either<ProductNotFoundError, Return>
}
