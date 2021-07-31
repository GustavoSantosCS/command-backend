import { UpdateUserAvatarUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { AppError } from '@/shared/errors';
import { makeMockAvatarUser } from '../models';

type Returns = {
  right: UpdateUserAvatarUseCase.Response;
  left: UpdateUserAvatarUseCase.Response;
};

export class UserAvatarUseCaseSpy implements UpdateUserAvatarUseCase {
  returns: Returns = {
    right: right(makeMockAvatarUser()),
    left: left(undefined)
  };
  return = this.returns.right;
  parameters = null;
  error: AppError;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async saveAvatar(
    data: UpdateUserAvatarUseCase.Params
  ): Promise<UpdateUserAvatarUseCase.Response> {
    if (this.error) throw this.error;
    this.parameters = data;

    return this.return;
  }
}
