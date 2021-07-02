import { UserModel } from '@/domain/models';
import { UserEntity } from '@/data/entities';

export interface UpdateUserRepository {
  update(
    user: UpdateUserRepository.Params
  ): Promise<UpdateUserRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserRepository {
  export type Params = UserModel;
  export type Result = UserEntity;
}
