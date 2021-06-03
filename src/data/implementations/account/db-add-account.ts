import {
  IDGenerator,
  AddAccountRepository,
  SearchAccountByEmailRepository
} from '@/data/protocols/';
import { Hasher } from '@/data/protocols/cryptography';
import { EmailAlreadyUseError } from '@/domain/errors';
import { Account } from '@/domain/models';
import { AddAccountUseCase } from '@/domain/usecases/account';
import { InternalServerError } from '@/presentation/errors';
import { Either, left, right } from '@/shared/either';

export class DBAddAccount implements AddAccountUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly hasher: Hasher,
    private readonly searchByEmailRepository: SearchAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(
    newAccount: AddAccountUseCase.DTO
  ): Promise<Either<EmailAlreadyUseError, Account>> {
    try {
      const { email } = newAccount;
      const searchResult = await this.searchByEmailRepository.searchByEmail(
        email
      );
      const emailIsUsing = searchResult.isRight();
      if (emailIsUsing) {
        return left(new EmailAlreadyUseError(email));
      }

      const hasherPassword = await this.hasher.hash(newAccount.password);
      const account = {
        ...newAccount,
        id: this.idGenerator.generate(),
        password: hasherPassword
      };

      const resultAddAccount = await this.addAccountRepository.save(account);
      if (resultAddAccount.isLeft()) {
        return left(new InternalServerError(resultAddAccount.value.stack));
      }
      return right(resultAddAccount.value);
    } catch (error) {
      return left(new InternalServerError(error.message));
    }
  }
}
