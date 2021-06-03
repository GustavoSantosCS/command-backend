import {
  IDGenerator,
  AddAccountRepository,
  SearchAccountByEmailRepository
} from '@/data/protocols/';
import { EmailAlreadyUseError, IDGeneratorFallError } from '@/domain/errors';
import { Account } from '@/domain/models';
import { AddAccountUseCase } from '@/domain/usecases/account';
import { InternalServerError } from '@/presentation/errors';
import { Either, left } from '@/shared/either';

export class DBAddAccount implements AddAccountUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly searchByEmailRepository: SearchAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(
    newAccount: AddAccountUseCase.DTO
  ): Promise<Either<EmailAlreadyUseError | IDGeneratorFallError, Account>> {
    try {
      const account = { ...newAccount, id: this.idGenerator.generate() };

      const { email } = account;
      const searchResult = await this.searchByEmailRepository.searchByEmail(
        email
      );
      const emailIsUsing = searchResult.isRight();
      if (emailIsUsing) {
        return left(new EmailAlreadyUseError(email));
      }
    } catch (error) {
      return left(new InternalServerError(error.message));
    }
    return null;
  }
}
