import { ProductEntity } from '@/data/entities';
import { EstablishmentNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface GetAllEstablishmentProductsUseCase {
  getAllEstablishmentProducts(
    establishmentId: string
  ): Promise<GetAllEstablishmentProductsUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentProductsUseCase {
  export type Return = Omit<ProductEntity, 'establishment'>[];

  export type Result = Either<EstablishmentNotFoundError, Return>;
}
