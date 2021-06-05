import { Either } from '@/shared/either';
import { UserModel } from '@/domain/models';
import { UserEntity } from '@/data/entities';
import { PersistencyError } from '@/infra/errors';

export interface AddUserRepository {
  save(user: UserModel): Promise<Either<PersistencyError, UserEntity>>;
}
