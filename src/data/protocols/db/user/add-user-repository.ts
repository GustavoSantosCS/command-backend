import { UserEntity } from '@/data/entities'

export interface AddUserRepository {
  save: (user: AddUserRepository.Params) => Promise<AddUserRepository.Result>
}

// eslint-disable-next-line no-redeclare
export namespace AddUserRepository {
  export type Params = UserEntity
  export type Result = UserEntity
}
