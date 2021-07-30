import { AvatarEntity } from '@/data/entities';
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
    userId,
    avatar
  }: UpdateUserAvatarUseCase.Params): Promise<UpdateUserAvatarUseCase.Response> {
    const userRepo = await this.getUserByIdRepo.getById(userId);
    const oldAvatar = userRepo.avatar;

    const newAvatar = new AvatarEntity();
    newAvatar.originalName = avatar.originalName;
    newAvatar.persistentName = avatar.persistentName;
    newAvatar.target = avatar.target;
    newAvatar.user = userRepo;

    const result = await this.avatarRepo.saveAvatar(newAvatar);

    if (oldAvatar) {
      await this.unlinkAvatar.removeAvatar(oldAvatar);
    }

    return right(result);
  }
}
