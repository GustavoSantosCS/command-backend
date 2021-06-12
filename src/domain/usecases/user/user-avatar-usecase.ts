import { PersistencyError } from '@/infra/errors';
import { AvatarModel } from '@/domain/models';
import { Either } from '@/shared/either';

export interface UserAvatarUseCase {
  save(data: UserAvatarUseCase.Params): Promise<UserAvatarUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace UserAvatarUseCase {
  export type Params = {
    user: {
      id: string;
    };
    avatar: {
      new: AvatarModel;
      old: AvatarModel;
    };
  };

  export type Response = Either<PersistencyError, AvatarModel>;
}
