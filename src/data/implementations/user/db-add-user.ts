import { PersistencyError } from '@/infra/errors';
import {
  IDGenerator,
  AddUserRepository,
  SearchUserByEmailRepository
} from '@/data/protocols/';
import { Hasher } from '@/data/protocols/cryptography';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';
import { AddUserUseCase } from '@/domain/usecases/user';
import { Either, left, right } from '@/shared/either';

export class DBAddUser implements AddUserUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly hasher: Hasher,
    private readonly searchByEmailRepository: SearchUserByEmailRepository,
    private readonly addUserRepository: AddUserRepository
  ) {}

  async add(
    newUser: AddUserUseCase.DTO
  ): Promise<Either<EmailAlreadyUseError | PersistencyError, UserModel>> {
    const { email } = newUser;
    const searchResult = await this.searchByEmailRepository.searchByEmail(
      email
    );
    const emailIsUsing = searchResult.isRight();
    if (emailIsUsing) {
      return left(new EmailAlreadyUseError(email));
    }

    const hasherPassword = await this.hasher.hash(newUser.password);
    const user = {
      ...newUser,
      id: this.idGenerator.generate(),
      password: hasherPassword
    };

    const resultAddUser = await this.addUserRepository.save(user);
    if (resultAddUser.isLeft()) {
      return left(resultAddUser.value);
    }
    return right(resultAddUser.value);
  }
}
