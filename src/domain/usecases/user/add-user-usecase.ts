import { UserEntity } from '@/data/entities'
import { EmailAlreadyUseError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface AddUserUseCase {
  save: (newUser: AddUserUseCase.Params) => Promise<AddUserUseCase.Response>
}

export namespace AddUserUseCase {
  export type Params = {
    name: string
    email: string
    password: string
  }
  export type Result = Omit<
    UserEntity,
    | 'password'
    | 'avatar'
    | 'establishments'
    | 'accounts'
    | 'pollVotes'
    | 'deletedAt'
  >
  export type Response = Either<EmailAlreadyUseError, Result>
}
