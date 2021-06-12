import { Either } from '@/shared/either';
import { AvatarModel } from '@/domain/models';
import { PersistencyError } from '@/infra/errors';

export interface UserAvatarRepository {
  saveInfoAvatar(
    data: UserAvatarRepository.DTO
  ): Promise<Either<PersistencyError, AvatarModel>>;
}

// eslint-disable-next-line no-redeclare
export namespace UserAvatarRepository {
  export type DTO = {
    user: { id: string };
    avatar: AvatarModel;
  };
}
