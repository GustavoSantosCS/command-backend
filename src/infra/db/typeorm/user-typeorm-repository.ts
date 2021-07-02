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

  async save(user: UserModel): Promise<UserEntity> {
    const repository = await TypeORMHelpers.getRepository(UserEntity);
    const userEntity = new UserEntity(user);
    const result = await repository.save(userEntity);
    return result;
  }

  async saveInfoAvatar({
    user,
    avatar
  }: {
    user: { id: string };
    avatar: AvatarModel;
  }): Promise<AvatarEntity> {
    const userRepo = await TypeORMHelpers.getRepository(UserEntity);
    const avatarEntity = new AvatarEntity(avatar);

    const userEntity = await userRepo.findOne(user.id, {
      relations: ['avatar']
    });
    const oldAvatar = userEntity.avatar;
    userEntity.avatar = avatarEntity;

    const avatarRepo = await TypeORMHelpers.getRepository(AvatarEntity);
    const resultAvatar = await avatarRepo.save(avatarEntity);
    if (oldAvatar) await avatarRepo.remove(oldAvatar);

    await userRepo.save(userEntity);

    return resultAvatar;
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

    const newUserEntity: UserEntity = Object.assign(userEntity, newUserData);
    await repository.save(newUserEntity);

    return newUserEntity;
  }

  private buildPersistentError(entity: any) {
    return new PersistencyError(
      'Erro ao Persistir No Banco de Dados',
      entity,
      'UserTypeOrmRepository'
    );
  }
}
