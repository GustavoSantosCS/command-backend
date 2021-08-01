import { TypeORMHelpers } from '@/infra/db/typeorm'
import { AvatarEntity, UserEntity } from '@/data/entities'
import {
  AddUserRepository,
  SearchUserByEmailRepository,
  UserAvatarRepository,
  GetUserByIdRepository,
  UpdateUserRepository
} from '@/data/protocols'

export class UserTypeOrmRepository
  implements
    AddUserRepository,
    SearchUserByEmailRepository,
    UserAvatarRepository,
    GetUserByIdRepository,
    UpdateUserRepository
{
  async searchByEmail(
    email: SearchUserByEmailRepository.Params
  ): Promise<SearchUserByEmailRepository.Result> {
    const userRepo = await TypeORMHelpers.getRepository(UserEntity)

    const findUser = await userRepo
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email })
      .getOne()

    return findUser
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const repository = await TypeORMHelpers.getRepository(UserEntity)
    const userRepo = await repository.save(user)
    return userRepo
  }

  async saveAvatar(avatar: AvatarEntity): Promise<AvatarEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const userEntity = await queryRunner.manager.findOne(
        UserEntity,
        avatar.user.id,
        { relations: ['avatar'] }
      )

      const oldAvatar = userEntity.avatar
      userEntity.avatar = avatar

      const avatarEntity = await queryRunner.manager.save(avatar)
      if (oldAvatar) await queryRunner.manager.remove(oldAvatar)

      await queryRunner.manager.save(userEntity)
      await queryRunner.commitTransaction()

      return avatarEntity
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getById(
    userId: GetUserByIdRepository.Params,
    config?: GetUserByIdRepository.Config
  ): Promise<GetUserByIdRepository.Result> {
    const userRepo = await TypeORMHelpers.getRepository(UserEntity)

    let queryBuilder = userRepo.createQueryBuilder('users')

    if (config?.withPassword) {
      queryBuilder = queryBuilder.addSelect('users.password')
    }

    if (config?.withAvatar) {
      queryBuilder = queryBuilder.leftJoinAndSelect('users.avatar', 'avatars')
    }

    const findUser = await queryBuilder
      .where('users.id = :userId', { userId })
      .getOne()

    return findUser
  }

  async update(
    newUserData: Omit<UserEntity, 'email'>
  ): Promise<UpdateUserRepository.Result> {
    const repository = await TypeORMHelpers.getRepository(UserEntity)

    const userEntity = await repository.findOne(newUserData.id, {
      relations: ['avatar']
    })

    const newUserEntity: UserEntity = Object.assign(userEntity, newUserData)
    await repository.save(newUserEntity)

    return newUserEntity
  }
}
