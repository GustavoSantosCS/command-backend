import { SearchUserByEmailRepository } from '@/data/protocols';
import { User } from '@/domain/models';
import { Either, left, right } from '@/shared/either';
import { makeMockUser } from '@tests/domain/mock/models';

type Returns = {
  right: Either<null, User>;
  left: Either<null, User>;
};
export class SearchUserByEmailRepositorySpy
  implements SearchUserByEmailRepository
{
  parameters: string;
  error: Error;
  returns: Returns = {
    right: right(makeMockUser()),
    left: left(null)
  };
  return: Either<null, User> = this.returns.left;

  throwsError() {
    this.error = new Error('any_message');
  }

  async searchByEmail(email: string): Promise<Either<null, User>> {
    this.parameters = email;
    if (this.error) throw this.error;
    return this.return;
  }
}
