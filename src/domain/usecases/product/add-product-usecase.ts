import { ImagePersistenceData, ProductModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface AddProductUseCase {
  save(data: AddProductUseCase.Params): AddProductUseCase.Response;
}

// eslint-disable-next-line no-redeclare
export namespace AddProductUseCase {
  export type Params = {
    idUser: string;
    establishmentId: string;
    name: string;
    description: string;
    price: number;
    productImage: ImagePersistenceData;
  };

  export type Response = Promise<Either<AppError, ProductModel>>;
}
