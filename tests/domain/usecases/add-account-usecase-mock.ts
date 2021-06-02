import { Either, right } from '@/shared/either';
import { AddressAlreadyUseError } from '@/domain/errors';
import { Account } from '@/domain/models';
import { makeMockAccount } from '@tests/domain/models';
import { AddAccountUseCase } from '@/domain/usecases/account';

class AddAccountUseCaseMock implements AddAccountUseCase {
  async add(
    newAccount: AddAccountUseCase.DTO
  ): Promise<Either<AddressAlreadyUseError, Account>> {
    return right(makeMockAccount());
  }
}

export const makeMockAddAccountUseCase = (): AddAccountUseCase =>
  new AddAccountUseCaseMock();
