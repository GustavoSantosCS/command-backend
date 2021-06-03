import { AddAccountRepository } from '@/data/protocols';
import { Account } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';
import { makeMockAccount } from '@tests/domain/mock/models';

type Returns = {
  right: Either<AppError, Account>;
  left: Either<AppError, Account>;
};

export class AddAccountRepositorySpy implements AddAccountRepository {
  parameters: Account;
  error: Error;
  returns: Returns = {
    right: right(makeMockAccount()),
    left: left(new AppError('any_message'))
  };
  return: Either<AppError, Account> = this.returns.right;

  throwsError() {
    this.error = new Error('any_message');
  }

  async save(account: Account): Promise<Either<AppError, Account>> {
    this.parameters = account;
    if (this.error) throw this.error;
    return this.return;
  }
}
