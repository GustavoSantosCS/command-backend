import { UserEntity } from '@/data/entities';
import { Either } from '@/shared/either';

export interface GetUserByIdRepository {
  getUserById(
    id: GetUserByIdRepository.Params
  ): Promise<GetUserByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetUserByIdRepository {
  export type Params = string;
  export type Result = UserEntity;
}
