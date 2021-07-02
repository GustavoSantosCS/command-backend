import { GetUserByIdRepository } from '@/data/protocols';
import { UserModel } from '@/domain/models';
import { GetAuthenticatedUserUseCase } from '@/domain/usecases';
import { UserNotFoundError } from '@/presentation/errors';
import { Either, left, right } from '@/shared/either';
// get-authenticated-user-controller
export class DBGetAuthenticatedUser implements GetAuthenticatedUserUseCase {
  constructor(private readonly repository: GetUserByIdRepository) {}

  async getUser(id: string): Promise<Either<UserNotFoundError, UserModel>> {
    const user = await this.repository.getUserById(id);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const userModel = user;
    delete userModel.deletedAt;

    return right(userModel as UserModel);
  }
}
