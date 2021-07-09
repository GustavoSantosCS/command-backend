import { AccountModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface CreateAccountUseCase {
  create(
    data: CreateAccountUseCase.Params
  ): Promise<Either<AppError, AccountModel>>;
}
// eslint-disable-next-line no-redeclare
export namespace CreateAccountUseCase {
  export type Params = {
    idUser: string;
    establishmentId: string;
  };
}
