import { AvatarModel } from '@/domain/models';
import { UpdateAvatarUseCase } from '@/domain/usecases/user';
import { PersistencyError } from '@/infra/errors';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';
import { makeMockAvatarUserModel } from '../models';

type Returns = {
  right: Either<PersistencyError, AvatarModel>;
  left: Either<PersistencyError, AvatarModel>;
};

export class UpdateAvatarUseCaseSpy implements UpdateAvatarUseCase {
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

  async updateAvatar(
    newUser: UpdateAvatarUseCase.DTO
  ): Promise<Either<PersistencyError, AvatarModel>> {
    if (this.error) throw this.error;
    this.parameters = newUser;

    return this.return;
  }
}
