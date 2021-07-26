import { UserEntity } from '@/data/entities';
import {
  IDGenerator,
  AddUserRepository,
  SearchUserByEmailRepository,
  Hasher
} from '@/data/protocols';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { AddUserUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBAddUser implements AddUserUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly hasher: Hasher;
  private readonly searchByEmailRepo: SearchUserByEmailRepository;
  private readonly addUserRepo: AddUserRepository;

  constructor(
    idGenerator: IDGenerator,
    hasher: Hasher,
    searchByEmailRepository: SearchUserByEmailRepository,
    addUserRepository: AddUserRepository
  ) {
    this.idGenerator = idGenerator;
    this.hasher = hasher;
    this.searchByEmailRepo = searchByEmailRepository;
    this.addUserRepo = addUserRepository;
  }

  async add(newUser: AddUserUseCase.Params): Promise<AddUserUseCase.Response> {
    const { name, email, password } = newUser;
    const searchResult = await this.searchByEmailRepo.searchByEmail(email);

    if (searchResult) {
      return left(new EmailAlreadyUseError(email));
    }

    const hasherPassword = await this.hasher.hash(password);
    const user: UserModel = {
      id: this.idGenerator.generate(),
      name,
      email,
      password: hasherPassword
    };

    const resultAddUser = await this.addUserRepo.save(user);

    const userResult: AddUserUseCase.Result = {
      id: resultAddUser.id,
      name: resultAddUser.name,
      email: resultAddUser.email,
      createdAt: resultAddUser.createdAt,
      updatedAt: resultAddUser.updatedAt
    };

    return right(userResult);
  }
}
