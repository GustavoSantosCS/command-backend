import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';
import { User } from '@/domain/models';

export interface AddUserRepository {
  save(user: User): Promise<Either<AppError, User>>;
}
