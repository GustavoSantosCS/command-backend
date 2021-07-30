import { RequestProductEntity } from '@/data/entities';
import { AccountNotFoundError, ProductNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface CreateRequestProductUseCase {
  createRequestProduct(
    newRequestProduct: CreateRequestProductUseCase.Params
  ): Promise<CreateRequestProductUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace CreateRequestProductUseCase {
  export type Params = {
    userId: string;
    productId: string;
    accountId: string;
    obs: string;
    total: number;
    amountOfProduct: number;
  };

  export type Return = Omit<RequestProductEntity, 'account' | 'closedAt'>;

  export type Result = Either<
    ProductNotFoundError | AccountNotFoundError,
    Return
  >;
}
