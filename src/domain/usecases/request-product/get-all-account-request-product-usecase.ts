import { RequestProductEntity } from '@/data/entities';
import { AccountNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface GetAllAccountRequestProductUseCase {
  getAllAccountRequestsProduct(
    accountId: string
  ): Promise<GetAllAccountRequestProductUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAllAccountRequestProductUseCase {
  export type Return = Omit<RequestProductEntity, 'account' | 'closedAt'>[];

  export type Result = Either<AccountNotFoundError, Return>;
}
