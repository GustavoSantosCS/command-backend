import { AvatarEntity } from '@/data/entities';

export interface UserAvatarRepository {
  saveAvatar(
    newAvatar: UserAvatarRepository.Params
  ): Promise<UserAvatarRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace UserAvatarRepository {
  export type Params = AvatarEntity;
  export type Result = AvatarEntity;
}
