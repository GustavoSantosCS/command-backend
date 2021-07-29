import { UserEntity } from '@/data/entities';

export interface GetUserByIdRepository {
  getById(
    id: GetUserByIdRepository.Params
  ): Promise<GetUserByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetUserByIdRepository {
  export type Params = string;
  export type Result = UserEntity;
}
