import { Either } from '@/shared/either';
import { AvatarModel } from '@/domain/models';
import { PersistencyError } from '@/infra/errors';

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

  export type Result = Either<PersistencyError, AvatarModel>;
}
