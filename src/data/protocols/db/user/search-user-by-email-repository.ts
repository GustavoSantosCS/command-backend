import { UserEntity } from '@/data/entities'

export interface SearchUserByEmailRepository {
  searchByEmail: (
    email: SearchUserByEmailRepository.Params
  ) => Promise<SearchUserByEmailRepository.Result>
}

export namespace SearchUserByEmailRepository {
  export type Params = string
  export type Result = UserEntity
}
