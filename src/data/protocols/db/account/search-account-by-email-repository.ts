import { Either } from '@/shared/either';
import { Account } from '@/domain/models';

export interface SearchAccountByEmailRepository {
  searchByEmail(email: string): Promise<Either<null, Account>>;
}
