import { UnlinkAvatar, UserAvatarRepository } from '@/data/protocols';
import { UserAvatarUseCase } from '@/domain/usecases/user';
import { left, right } from '@/shared/either';

export class DBUserAvatar implements UserAvatarUseCase {
  constructor(
    private readonly unlinkAvatar: UnlinkAvatar,
    private readonly repository: UserAvatarRepository
  ) {}

  async save(
    data: UserAvatarUseCase.Params
  ): Promise<UserAvatarUseCase.Response> {
    const { user, avatar } = data;
    if (data.avatar.old) {
      await this.unlinkAvatar.removeAvatar(data.avatar.old);
    }

    const result = await this.repository.saveInfoAvatar({
      user,
      avatar: avatar.new
    });

    return result.isRight() ? right(result.value) : left(result.value);
  }
}
