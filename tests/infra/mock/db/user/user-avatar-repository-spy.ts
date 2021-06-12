import { AvatarModel } from '@/domain/models';
import { PersistencyError } from '@/infra/errors';
import { Either, left, right } from '@/shared/either';
import { UserAvatarRepository } from '@/data/protocols';
import { makeMockAvatarUserModel } from '@tests/domain/mock/models';

type Returns = {
  right: Either<PersistencyError, AvatarModel>;
  left: Either<PersistencyError, AvatarModel>;
};

export class UserAvatarRepositorySpy implements UserAvatarRepository {
  parameters: any;
  error: Error;
  calls = 0;
  returns: Returns = {
    right: right(makeMockAvatarUserModel()),
    left: left(new PersistencyError('any_message', {}, 'any_value'))
  };
  return: Either<PersistencyError, AvatarModel> = this.returns.right;

  throwsError() {
    this.error = new Error('any_message');
  }

  async saveInfoAvatar(
    data: UserAvatarRepository.Params
  ): Promise<Either<PersistencyError, AvatarModel>> {
    this.calls += 1;
    this.parameters = data;
    if (this.error) throw this.error;
    return this.return;
  }
}
