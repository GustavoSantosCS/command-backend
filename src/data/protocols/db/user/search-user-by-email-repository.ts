import { UserEntity } from '@/data/entities'

export interface SearchUserByEmailRepository {
  searchByEmail: (
    email: SearchUserByEmailRepository.Params,
    config?: SearchUserByEmailRepository.Config
  ) => Promise<SearchUserByEmailRepository.Result>
}

export namespace SearchUserByEmailRepository {
  export type Params = string
  export type Config = {
    withPassword?: boolean
    withAvatar?: boolean
  }
  export type Result = UserEntity
}
