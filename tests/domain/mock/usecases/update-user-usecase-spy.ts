import { Either, left, right } from '@/shared/either';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { makeMockUserModel } from '@tests/domain/mock/models';
import { UpdateUserUseCase } from '@/domain/usecases/user';
import { AppError } from '@/shared/app-error';

type Returns = {
  right: Either<EmailAlreadyUseError, UserModel>;
  left: Either<EmailAlreadyUseError, UserModel>;
};

export class UpdateUserUseCaseSpy implements UpdateUserUseCase {
  returns: Returns = {
    right: right(makeMockUserModel({ id: true, avatar: false })),
    left: left(new EmailAlreadyUseError(''))
  };

  return = this.returns.right;
  parameters = null;
  calls = 0;
  error: AppError;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async update(newUserData: UserModel): Promise<UpdateUserUseCase.Response> {
    this.parameters = newUserData;
    this.calls += 1;
    if (this.error) throw this.error;
    return this.return;
  }
}
