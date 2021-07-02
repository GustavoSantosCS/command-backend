import {
  GetUserByIdRepository,
  Hasher,
  SearchUserByEmailRepository,
  UpdateUserRepository
} from '@/data/protocols';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { UpdateUserUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBUpdateUser implements UpdateUserUseCase {
  constructor(
    private readonly getUserByIdRepo: GetUserByIdRepository,
    private readonly hasher: Hasher,
    private readonly searchByEmailRepo: SearchUserByEmailRepository,
    private readonly updateUserRepo: UpdateUserRepository
  ) {}

  async update(newUser: UserModel): Promise<UpdateUserUseCase.Response> {
    const trackedUser = await this.getUserByIdRepo.getUserById(newUser.id);

    if (trackedUser.email !== newUser.email) {
      const foundUser = await this.searchByEmailRepo.searchByEmail(
        newUser.email
      );

      if (foundUser) return left(new EmailAlreadyUseError(newUser.email));
    }

    const user: UserModel = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      password: await this.hasher.hash(newUser.password),
      avatar: newUser.avatar
    };

    const result = await this.updateUserRepo.update(user);

    const userReturn: Omit<UserModel, 'password'> = {
      id: result.id,
      name: result.name,
      email: result.email,
      avatar: result.avatar,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };

    return right(userReturn);
  }
}
