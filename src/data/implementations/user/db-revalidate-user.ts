import { GetUserByIdRepository } from '@/data/protocols';
import { UserModel } from '@/domain/models';
import { RevalidateUserUseCase } from '@/domain/usecases';
import { UserNotFoundError } from '@/presentation/errors';
import { Either, left, right } from '@/shared/either';

export class DBRevalidateUser implements RevalidateUserUseCase {
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
