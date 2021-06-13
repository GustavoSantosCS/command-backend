import { PersistencyError } from '@/infra/errors';
import { AvatarModel } from '@/domain/models';
import { Either } from '@/shared/either';

export interface UserAvatarUseCase {
  saveAvatar(
    data: UserAvatarUseCase.Params
  ): Promise<UserAvatarUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace UserAvatarUseCase {
  export type Params = {
    user: {
      id: string;
    };
    avatar: AvatarModel;
  };

  export type Response = Either<PersistencyError, AvatarModel>;
}
