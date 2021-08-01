import { UserEntity } from '@/data/entities'

export interface GetUserByIdRepository {
  getById: (
    userId: GetUserByIdRepository.Params,
    config?: GetUserByIdRepository.Config
  ) => Promise<GetUserByIdRepository.Result>
}

export namespace GetUserByIdRepository {
  export type Params = string

  export type Config = {
    withPassword?: boolean
    withAvatar?: boolean
  }
  export type Result = UserEntity
}
