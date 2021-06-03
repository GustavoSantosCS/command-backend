import {
  AddUserRepository,
  SearchUserByEmailRepository
} from '@/data/protocols';

import { User } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export class UserRepository
  implements AddUserRepository, SearchUserByEmailRepository
{
  searchByEmail(email: string): Promise<Either<null, User>> {
    throw new Error('Method not implemented.');
  }

  save(user: User): Promise<Either<AppError, User>> {
    throw new Error('Method not implemented.');
  }
}
