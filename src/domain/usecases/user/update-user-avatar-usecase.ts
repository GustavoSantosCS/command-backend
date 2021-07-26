import { AvatarEntity } from '@/data/entities';
import { AvatarModel } from '@/domain/models';
import { Either } from '@/shared/either';

export interface UpdateUserAvatarUseCase {
  saveAvatar(
    data: UpdateUserAvatarUseCase.Params
  ): Promise<UpdateUserAvatarUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserAvatarUseCase {
  export type Params = {
    user: {
      id: string;
    };
    avatar: AvatarModel;
  };

  export type Response = Either<undefined, AvatarEntity>;
}
