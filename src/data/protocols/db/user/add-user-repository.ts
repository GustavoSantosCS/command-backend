import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';
import { UserModel } from '@/domain/models';
import { UserEntity } from '@/data/entities';

export interface AddUserRepository {
  save(user: UserModel): Promise<Either<AppError, UserEntity>>;
}
