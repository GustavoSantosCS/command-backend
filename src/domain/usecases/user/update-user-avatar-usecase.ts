import { PersistencyError } from '@/infra/errors';
import { AvatarModel } from '@/domain/models';
import { Either } from '@/shared/either';

export interface UpdateAvatarUseCase {
  updateAvatar(
    data: UpdateAvatarUseCase.DTO
  ): Promise<UpdateAvatarUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdateAvatarUseCase {
  export type DTO = {
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
