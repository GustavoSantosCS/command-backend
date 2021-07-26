import { UpdateUserRepository } from '@/data/protocols';
import { makeMockUserEntity } from '@tests/data/mock/entities';

export class UpdateUserRepositorySpy implements UpdateUserRepository {
  parameters: any;
  calls = 0;
  error: Error;
  return = makeMockUserEntity();

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
