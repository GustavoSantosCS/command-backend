import { UserEntity } from '@/data/entities'

export interface UpdateUserRepository {
  update: (
    user: UpdateUserRepository.Params
  ) => Promise<UpdateUserRepository.Result>
}

export namespace UpdateUserRepository {
  export type Params = UserEntity
  export type Result = UserEntity
}
