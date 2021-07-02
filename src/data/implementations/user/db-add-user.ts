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
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly hasher: Hasher,
    private readonly searchByEmailRepository: SearchUserByEmailRepository,
    private readonly addUserRepository: AddUserRepository
  ) {}

  async add(newUser: AddUserUseCase.Params): Promise<AddUserUseCase.Response> {
    const { name, email, password } = newUser;
    const searchResult = await this.searchByEmailRepository.searchByEmail(
      email
    );

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

    const resultAddUser = await this.addUserRepository.save(user);

    const userResult: Omit<
      UserModel,
      'password' | 'establishments' | 'avatar'
    > = {
      id: resultAddUser.id,
      name: resultAddUser.name,
      email: resultAddUser.email,
      createdAt: resultAddUser.createdAt,
      updatedAt: resultAddUser.updatedAt
    };

    return right(userResult);
  }
}
