import { UserEntity } from '@/data/entities';
import { AddUserRepository } from '@/data/protocols';
import { UserModel } from '@/domain/models';
import { PersistencyError } from '@/infra/errors';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';
import { makeMockUserEntity } from '@tests/data/mock/entities';

type Returns = {
  right: Either<AppError, UserEntity>;
  left: Either<AppError, UserEntity>;
};

export class AddUserRepositorySpy implements AddUserRepository {
  parameters: UserModel;
  error: Error;
  returns: Returns = {
    right: right(makeMockUserEntity()),
    left: left(new PersistencyError('any_message', {}, 'any_value'))
  };
  return: Either<AppError, UserEntity> = this.returns.right;

  throwsError() {
    this.error = new Error('any_message');
  }

  async save(user: UserModel): Promise<Either<PersistencyError, UserEntity>> {
    this.parameters = user;
    if (this.error) throw this.error;
    return this.return;
  }
}
