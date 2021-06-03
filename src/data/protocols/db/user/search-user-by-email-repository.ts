import { Either } from '@/shared/either';
import { User } from '@/domain/models';

export interface SearchUserByEmailRepository {
  searchByEmail(email: string): Promise<Either<null, User>>;
}
