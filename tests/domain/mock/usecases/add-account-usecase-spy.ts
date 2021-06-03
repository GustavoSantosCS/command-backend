import { Either, left, right } from '@/shared/either';
import { EmailAlreadyUseError } from '@/domain/errors';
import { Account } from '@/domain/models';
import { makeMockAccount } from '@tests/domain/mock/models';
import { AddAccountUseCase } from '@/domain/usecases/account';
import { AppError } from '@/shared/app-error';

type Returns = {
  right: Either<EmailAlreadyUseError, Account>;
  left: Either<EmailAlreadyUseError, Account>;
};

export class AddAccountUseCaseSpy implements AddAccountUseCase {
  returns: Returns = {
    right: right(makeMockAccount()),
    left: left(new EmailAlreadyUseError(''))
  };
  return = this.returns.right;
  parameters = null;
  error: AppError;

  throwError() {
    this.error = new AppError('any_message', 'any_value');
  }

  async add(
    newAccount: AddAccountUseCase.DTO
  ): Promise<Either<EmailAlreadyUseError, Account>> {
    if (this.error) throw this.error;
    this.parameters = newAccount;

    if (this.return.isLeft()) {
      this.return.value.value = newAccount.email;
    }

    return this.return;
  }
}
