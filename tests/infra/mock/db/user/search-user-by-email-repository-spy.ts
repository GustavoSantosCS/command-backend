import { UserEntity } from '@/data/entities';
import { SearchUserByEmailRepository } from '@/data/protocols';
import { Either, left, right } from '@/shared/either';
import { makeMockUserEntity } from '@tests/data/mock/entities';

type Returns = {
  right: Either<null, UserEntity>;
  left: Either<null, UserEntity>;
};
export class SearchUserByEmailRepositorySpy
  implements SearchUserByEmailRepository
{
  parameters: string;
  error: Error;
  returns: Returns = {
    right: right(makeMockUserEntity()),
    left: left(null)
  };
  return: Either<null, UserEntity> = this.returns.left;

  throwsError() {
    this.error = new Error('any_message');
  }

  async searchByEmail(email: string): Promise<Either<null, UserEntity>> {
    this.parameters = email;
    if (this.error) throw this.error;
    return this.return;
  }
}
