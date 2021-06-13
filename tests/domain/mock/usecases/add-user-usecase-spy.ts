import { Either, left, right } from '@/shared/either';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { makeMockUserModel } from '@tests/domain/mock/models';
import { AddUserUseCase } from '@/domain/usecases/user';
import { AppError } from '@/shared/app-error';

type Returns = {
  right: Either<EmailAlreadyUseError, UserModel>;
  left: Either<EmailAlreadyUseError, UserModel>;
};

export class AddUserUseCaseSpy implements AddUserUseCase {
  returns: Returns = {
    right: right(makeMockUserModel({ id: true, avatar: false })),
    left: left(new EmailAlreadyUseError(''))
  };
  return = this.returns.right;
  parameters = null;
  error: AppError;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async add(
    newUser: AddUserUseCase.Params
  ): Promise<Either<EmailAlreadyUseError, UserModel>> {
    if (this.error) throw this.error;
    this.parameters = newUser;

    if (this.return.isLeft()) {
      this.return.value.value = newUser.email;
    }

    return this.return;
  }
}
