import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';
import { Account } from '@/domain/models';

export interface AddAccountRepository {
  save(account: Account): Promise<Either<AppError, Account>>;
}
