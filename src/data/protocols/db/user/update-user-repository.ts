import { Either } from '@/shared/either';
import { UserModel } from '@/domain/models';
import { UserEntity } from '@/data/entities';
import { PersistencyError } from '@/infra/errors';

export interface UpdateUserRepository {
  update(
    user: UpdateUserRepository.Params
  ): Promise<UpdateUserRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserRepository {
  export type Params = Omit<UserModel, 'email'>;
  export type Result = Either<PersistencyError, UserEntity>;
}
