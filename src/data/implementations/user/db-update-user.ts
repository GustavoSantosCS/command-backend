import {
  GetUserByIdRepository,
  HashComparer,
  Hasher,
  SearchUserByEmailRepository,
  UpdateUserRepository
} from '@/data/protocols';
import { EmailAlreadyUseError, IncorrectPasswordError } from '@/domain/errors';
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

  async update(
    updateUserData: UserEntity
  ): Promise<UpdateUserUseCase.Response> {
    const userRepo = await this.getUserByIdRepo.getById(updateUserData.id);

    if (
      !(await this.hashComparer.compare(
        updateUserData.password,
        userRepo.password
      ))
    )
      return left(new IncorrectPasswordError(updateUserData.password));

    if (userRepo.email !== updateUserData.email) {
      const foundUser = await this.searchByEmailRepo.searchByEmail(
        updateUserData.email
      );

      if (foundUser)
        return left(new EmailAlreadyUseError(updateUserData.email));
    }

    const updateUser = new UserEntity();
    updateUser.id = userRepo.id;
    updateUser.name = updateUserData.name;
    updateUser.email = updateUserData.email;
    updateUser.password = await this.hasher.hash(updateUserData.password);

    const result = await this.updateUserRepo.update(updateUser);

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
