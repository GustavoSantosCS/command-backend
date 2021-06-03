import { Either } from '@/shared/either';
import { UserEntity } from '@/data/entities';

export interface SearchUserByEmailRepository {
  searchByEmail(email: string): Promise<Either<null, UserEntity>>;
}
