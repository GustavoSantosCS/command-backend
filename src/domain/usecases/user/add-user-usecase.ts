import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel, AccountType } from '@/domain/models';
import { Either } from '@/shared/either';

export interface AddUserUseCase {
  add(newUser: AddUserUseCase.DTO): Promise<AddUserUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace AddUserUseCase {
  export type DTO = {
    nome: string;
    email: string;
    password: string;
    accountType: AccountType;
  };

  export type Response = Either<EmailAlreadyUseError, UserModel>;
}
