import { AvatarModel } from '@/domain/models';
import { AvatarEntity } from '@/data/entities';

export interface UserAvatarRepository {
  saveInfoAvatar(
    data: UserAvatarRepository.Params
  ): Promise<UserAvatarRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace UserAvatarRepository {
  export type Params = {
    user: { id: string };
    avatar: AvatarModel;
  };

  export type Result = AvatarEntity;
}
