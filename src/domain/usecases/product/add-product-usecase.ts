import { ImagePersistenceData } from '@/domain/models';
import { Either } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';
import { ProductEntity } from '@/data/entities';

export interface AddProductUseCase {
  save(newProduct: AddProductUseCase.Params): AddProductUseCase.Result;
}

// eslint-disable-next-line no-redeclare
export namespace AddProductUseCase {
  export type Params = {
    userId: string;
    establishmentId: string;
    name: string;
    description: string;
    price: number;
    productImage: ImagePersistenceData;
  };

  export type Return = Omit<ProductEntity, 'establishment'>;

  export type Result = Promise<Either<EstablishmentNotFoundError, Return>>;
}
