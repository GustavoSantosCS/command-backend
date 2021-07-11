import { RequestProductEntity } from '@/data/entities';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface CreateRequestProductUseCase {
  createRequestProduct(
    data: CreateRequestProductUseCase.Params
  ): Promise<Either<AppError, RequestProductEntity>>;
}

// eslint-disable-next-line no-redeclare
export namespace CreateRequestProductUseCase {
  export type Params = {
    idProduct: string;
    idAccount: string;
    obs: string;
    total: number;
    amountOfProduct: number;
  };
}
