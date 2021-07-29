import {
  GetUserByIdRepository,
  UnlinkAvatar,
  UserAvatarRepository
} from '@/data/protocols';
import { UpdateUserAvatarUseCase } from '@/domain/usecases';
import { right } from '@/shared/either';

export class DBUserAvatar implements UpdateUserAvatarUseCase {
  private readonly getUserByIdRepo: GetUserByIdRepository;
  private readonly unlinkAvatar: UnlinkAvatar;
  private readonly avatarRepo: UserAvatarRepository;

  constructor(
    getUserByIdRepository: GetUserByIdRepository,
    unlinkAvatar: UnlinkAvatar,
    avatarRepository: UserAvatarRepository
  ) {
    this.getUserByIdRepo = getUserByIdRepository;
    this.unlinkAvatar = unlinkAvatar;
    this.avatarRepo = avatarRepository;
  }

  async saveAvatar({
    user,
    avatar
  }: UpdateUserAvatarUseCase.Params): Promise<UpdateUserAvatarUseCase.Response> {
    const userEntity = await this.getUserByIdRepo.getById(user.id);

    if (userEntity.avatar) {
      await this.unlinkAvatar.removeAvatar(userEntity.avatar);
    }

    const result = await this.avatarRepo.saveInfoAvatar({
      user: { id: user.id },
      avatar
    });

    return right(result);
  }
}
