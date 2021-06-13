import { UpdateUserRepository } from '@/data/protocols';
import { PersistencyError } from '@/infra/errors';
import { left, right } from '@/shared/either';
import { makeMockUserEntity } from '@tests/data/mock/entities';

type Returns = {
  right: UpdateUserRepository.Result;
  left: UpdateUserRepository.Result;
};

export class UpdateUserRepositorySpy implements UpdateUserRepository {
  parameters: any;
  calls = 0;
  error: Error;
  returns: Returns = {
    right: right(makeMockUserEntity()),
    left: left(new PersistencyError('any_message', {}, 'any_value'))
  };
  return: UpdateUserRepository.Result = this.returns.right;

  throwsError() {
    this.error = new Error('any_message');
  }

  async update(
    user: UpdateUserRepository.Params
  ): Promise<UpdateUserRepository.Result> {
    this.parameters = user;
    this.calls += 1;
    if (this.error) throw this.error;
    return this.return;
  }
}
