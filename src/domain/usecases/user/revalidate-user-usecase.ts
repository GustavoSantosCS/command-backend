import { UserModel } from '@/domain/models';
import { UserNotFoundError } from '@/presentation/errors';
import { Either } from '@/shared/either';

export interface RevalidateUserUseCase {
  getUser(id: string): Promise<Either<UserNotFoundError, UserModel>>;
}
