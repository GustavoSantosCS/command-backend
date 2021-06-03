import { Either, left, right } from '@/shared/either';
import { EmailAlreadyUseError } from '@/domain/errors';
import { User } from '@/domain/models';
import { makeMockUser } from '@tests/domain/mock/models';
import { AddUserUseCase } from '@/domain/usecases/user';
import { AppError } from '@/shared/app-error';

type Returns = {
  right: Either<EmailAlreadyUseError, User>;
  left: Either<EmailAlreadyUseError, User>;
};

export class AddUserUseCaseSpy implements AddUserUseCase {
  returns: Returns = {
    right: right(makeMockUser()),
    left: left(new EmailAlreadyUseError(''))
  };
  return = this.returns.right;
  parameters = null;
  error: AppError;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async add(
    newUser: AddUserUseCase.DTO
  ): Promise<Either<EmailAlreadyUseError, User>> {
    if (this.error) throw this.error;
    this.parameters = newUser;

    if (this.return.isLeft()) {
      this.return.value.value = newUser.email;
    }

    return this.return;
  }
}
