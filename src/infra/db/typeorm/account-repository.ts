import {
  AddAccountRepository,
  SearchAccountByEmailRepository
} from '@/data/protocols';

import { Account } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export class AccountRepository
  implements AddAccountRepository, SearchAccountByEmailRepository
{
  searchByEmail(email: string): Promise<Either<null, Account>> {
    throw new Error('Method not implemented.');
  }

  save(account: Account): Promise<Either<AppError, Account>> {
    throw new Error('Method not implemented.');
  }
}
