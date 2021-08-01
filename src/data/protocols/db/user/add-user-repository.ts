import { UserEntity } from '@/data/entities'

export interface AddUserRepository {
  save: (user: AddUserRepository.Params) => Promise<AddUserRepository.Result>
}

export namespace AddUserRepository {
  export type Params = UserEntity
  export type Result = UserEntity
}
