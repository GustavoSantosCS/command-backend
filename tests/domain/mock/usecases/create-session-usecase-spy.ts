import faker from 'faker';
import { right } from '@/shared/either';

import { CreateSessionUseCase } from '@/domain/usecases/session';
import { AppError } from '@/shared/app-error';
import { UserModel } from '@/domain/models';

export const makeMockUserSession = (): Omit<UserModel, 'password'> => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
});

export class CreateSessionUseCaseSpy implements CreateSessionUseCase {
  return: CreateSessionUseCase.Result = right({
    token: 'token',
    user: makeMockUserSession()
  });
  parameters = null;
  error: AppError;
  calls = 0;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async createSession(
    data: CreateSessionUseCase.Params
  ): Promise<CreateSessionUseCase.Result> {
    this.parameters = data;
    this.calls += 1;
    if (this.error) throw this.error;

    return this.return;
  }
}
