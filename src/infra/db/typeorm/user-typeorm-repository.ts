import { Repository } from 'typeorm';
import { TypeORMHelpers } from '@/infra/db/typeorm';
import { UserEntity } from '@/data/entities';
import {
  AddUserRepository,
  SearchUserByEmailRepository
} from '@/data/protocols';
import { UserModel } from '@/domain/models';
import { Either, left, right } from '@/shared/either';
import { PersistencyError } from '@/infra/errors';

export class UserTypeOrmRepository
  implements AddUserRepository, SearchUserByEmailRepository
{
  private repository: Repository<UserEntity>;

  async searchByEmail(email: string): Promise<Either<null, UserEntity>> {
    this.repository = await TypeORMHelpers.getRepository(UserEntity);
    const findUser = await this.repository.findOne({
      where: [{ email }],
      withDeleted: false
    });

    return findUser ? right(findUser) : left(null);
  }

  async save(user: UserModel): Promise<Either<PersistencyError, UserEntity>> {
    this.repository = await TypeORMHelpers.getRepository(UserEntity);
    const userEntity = new UserEntity(user);
    const result = await this.repository.save(userEntity);
    return !result
      ? left(
          new PersistencyError(
            'Erro ao Persistir No Banco de Dados',
            user,
            'UserTypeOrmRepository'
          )
        )
      : right(result);
  }
}
