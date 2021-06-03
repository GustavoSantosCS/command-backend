import { AddUserRepository } from '@/data/protocols';
import { User } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';
import { makeMockUser } from '@tests/domain/mock/models';

type Returns = {
  right: Either<AppError, User>;
  left: Either<AppError, User>;
};

export class AddUserRepositorySpy implements AddUserRepository {
  parameters: User;
  error: Error;
  returns: Returns = {
    right: right(makeMockUser()),
    left: left(new AppError('any_message'))
  };
  return: Either<AppError, User> = this.returns.right;

  throwsError() {
    this.error = new Error('any_message');
  }

  async save(user: User): Promise<Either<AppError, User>> {
    this.parameters = user;
    if (this.error) throw this.error;
    return this.return;
  }
}
