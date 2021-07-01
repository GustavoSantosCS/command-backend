import {
  GetUserByIdRepository,
  UnlinkAvatar,
  UserAvatarRepository
} from '@/data/protocols';
import { UserAvatarUseCase } from '@/domain/usecases';

export class DBUserAvatar implements UserAvatarUseCase {
  constructor(
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly unlinkAvatar: UnlinkAvatar,
    private readonly avatarRepository: UserAvatarRepository
  ) {}

  async saveAvatar({
    user,
    avatar
  }: UserAvatarUseCase.Params): Promise<UserAvatarUseCase.Response> {
    const userEntity = await this.getUserByIdRepository.getUserById(user.id);

    if (userEntity.avatar) {
      await this.unlinkAvatar.removeAvatar(userEntity.avatar);
    }

    const result = await this.avatarRepository.saveInfoAvatar({
      user: { id: user.id },
      avatar
    });

    return result;
  }
}
