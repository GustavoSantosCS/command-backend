import { AvatarModel } from '@/domain/models';
import { UserAvatarUseCase } from '@/domain/usecases/user';
import { PersistencyError } from '@/infra/errors';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';
import { makeMockAvatarUserModel } from '../models';

type Returns = {
  right: Either<PersistencyError, AvatarModel>;
  left: Either<PersistencyError, AvatarModel>;
};

export class UserAvatarUseCaseSpy implements UserAvatarUseCase {
  returns: Returns = {
    right: right(makeMockAvatarUserModel()),
    left: left(new PersistencyError('any_message', {}, 'any_value'))
  };
  return = this.returns.right;
  parameters = null;
  error: AppError;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async save(data: UserAvatarUseCase.DTO): Promise<UserAvatarUseCase.Response> {
    if (this.error) throw this.error;
    this.parameters = data;

    return this.return;
  }
}
