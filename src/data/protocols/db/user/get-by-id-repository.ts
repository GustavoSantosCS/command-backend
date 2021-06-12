import { UserEntity } from '@/data/entities';
import { Either } from '@/shared/either';

export interface GetUserByIdRepository {
  getUserById(id: string): Promise<Either<null, UserEntity>>;
}
