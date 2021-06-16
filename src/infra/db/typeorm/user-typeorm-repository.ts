import { TypeORMHelpers } from '@/infra/db/typeorm';
import { AvatarEntity, UserEntity } from '@/data/entities';
import {
  AddUserRepository,
  SearchUserByEmailRepository,
  UserAvatarRepository,
  GetUserByIdRepository,
  UpdateUserRepository
} from '@/data/protocols';
import { AvatarModel, UserModel } from '@/domain/models';
import { Either, left, right } from '@/shared/either';
import { PersistencyError } from '@/infra/errors';

export class UserTypeOrmRepository
  implements
    AddUserRepository,
    SearchUserByEmailRepository,
    UserAvatarRepository,
    GetUserByIdRepository,
    UpdateUserRepository
{
  async searchByEmail(email: string): Promise<UserEntity> {
    const repository = await TypeORMHelpers.getRepository(UserEntity);
    const findUser = await repository.findOne({
      where: [{ email }],
      withDeleted: false,
      relations: ['avatar']
    });

    return findUser;
  }

  async save(user: UserModel): Promise<Either<PersistencyError, UserEntity>> {
    const repository = await TypeORMHelpers.getRepository(UserEntity);
    const userEntity = new UserEntity(user);
    const result = await repository.save(userEntity);
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

  async saveInfoAvatar({
    user,
    avatar
  }: {
    user: { id: string };
    avatar: AvatarModel;
  }): Promise<Either<PersistencyError, AvatarModel>> {
    const repository = await TypeORMHelpers.getRepository(UserEntity);
    const avatarEntity = new AvatarEntity(avatar);

    const userEntity = await repository.findOne(user.id);
    userEntity.avatar = avatarEntity;

    const repositoryAvatar = await TypeORMHelpers.getRepository(AvatarEntity);
    const resultAvatar = await repositoryAvatar.save(avatarEntity);

    if (!resultAvatar) return left(this.buildPersistentError(avatarEntity));

    const result = await repository.save(userEntity);

    return !result
      ? left(this.buildPersistentError(avatarEntity))
      : right(avatar);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const repository = await TypeORMHelpers.getRepository(UserEntity);
    const userEntity = await repository.findOne(id, {
      relations: ['avatar']
    });

    return userEntity;
  }

  async update(
    newUserData: Omit<UserModel, 'email'>
  ): Promise<UpdateUserRepository.Result> {
    const repository = await TypeORMHelpers.getRepository(UserEntity);

    const userEntity = await repository.findOne(newUserData.id, {
      relations: ['avatar']
    });

    const newUser: UserEntity = Object.assign(userEntity, newUserData);
    await repository.save(newUser);

    return right(newUser);
  }

  private buildPersistentError(entity: any) {
    return new PersistencyError(
      'Erro ao Persistir No Banco de Dados',
      entity,
      'UserTypeOrmRepository'
    );
  }
}
