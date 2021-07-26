import { UserEntity } from '@/data/entities';
import { IncorrectPasswordError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { Either } from '@/shared/either';

export interface UpdateUserUseCase {
  update(
    newUserData: UpdateUserUseCase.Params
  ): Promise<UpdateUserUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserUseCase {
  export type Params = UserModel;
  export type Response = Either<
    IncorrectPasswordError,
    Omit<
      UserEntity,
      | 'password'
      | 'establishments'
      | 'accounts'
      | 'password'
      | 'pollVotes'
      | 'deletedAt'
    >
  >;
}
