import {
  GetUserByIdRepository,
  HashComparer,
  Hasher,
  SearchUserByEmailRepository,
  UpdateUserRepository
} from '@/data/protocols';
import { EmailAlreadyUseError, IncorrectPasswordError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { UpdateUserUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { UserEntity } from '@/data/entities';

export class DBUpdateUser implements UpdateUserUseCase {
  private readonly getUserByIdRepo: GetUserByIdRepository;
  private readonly hasher: Hasher;
  private readonly hashComparer: HashComparer;
  private readonly searchByEmailRepo: SearchUserByEmailRepository;
  private readonly updateUserRepo: UpdateUserRepository;

  constructor(
    getUserByIdRepo: GetUserByIdRepository,
    hasher: Hasher,
    hashComparer: HashComparer,
    searchByEmailRepo: SearchUserByEmailRepository,
    updateUserRepo: UpdateUserRepository
  ) {
    this.getUserByIdRepo = getUserByIdRepo;
    this.hasher = hasher;
    this.hashComparer = hashComparer;
    this.searchByEmailRepo = searchByEmailRepo;
    this.updateUserRepo = updateUserRepo;
  }

  async update(newUser: UserModel): Promise<UpdateUserUseCase.Response> {
    const trackedUser = await this.getUserByIdRepo.getById(newUser.id);

    if (
      !(await this.hashComparer.compare(newUser.password, trackedUser.password))
    )
      return left(new IncorrectPasswordError(newUser.password));

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

    const userReturn: Omit<
      UserEntity,
      | 'password'
      | 'establishments'
      | 'accounts'
      | 'password'
      | 'pollVotes'
      | 'deletedAt'
    > = {
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
