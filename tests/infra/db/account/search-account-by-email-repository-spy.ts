import { SearchAccountByEmailRepository } from '@/data/protocols';
import { Account } from '@/domain/models';
import { Either, left, right } from '@/shared/either';
import { makeMockAccount } from '@tests/domain/models';

type Returns = {
  right: Either<null, Account>;
  left: Either<null, Account>;
};
export class SearchAccountByEmailRepositorySpy
  implements SearchAccountByEmailRepository
{
  parameters: string;
  error: Error;
  returns: Returns = {
    right: right(makeMockAccount()),
    left: left(null)
  };
  return: Either<null, Account> = this.returns.left;

  throwsError() {
    this.error = new Error('any_message');
  }

  async searchByEmail(email: string): Promise<Either<null, Account>> {
    this.parameters = email;
    if (this.error) throw this.error;
    return this.return;
  }
}
