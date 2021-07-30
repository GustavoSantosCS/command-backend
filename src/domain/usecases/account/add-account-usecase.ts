import { Either } from '@/shared/either';
import { AccountEntity } from '@/data/entities';
import { EstablishmentNotFoundError } from '@/domain/errors';

export interface CreateAccountUseCase {
  add(data: CreateAccountUseCase.Params): Promise<CreateAccountUseCase.Result>;
}
// eslint-disable-next-line no-redeclare
export namespace CreateAccountUseCase {
  export type Params = {
    userId: string;
    establishmentId: string;
  };

  export type Return = Omit<AccountEntity, 'closedAt'>;

  export type Result = Either<EstablishmentNotFoundError, Return>;
}
