import { PersistencyError } from '@/infra/errors';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { Either } from '@/shared/either';

export interface AddUserUseCase {
  add(newUser: AddUserUseCase.Params): Promise<AddUserUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace AddUserUseCase {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = Either<
    EmailAlreadyUseError | PersistencyError,
    UserModel
  >;
}
