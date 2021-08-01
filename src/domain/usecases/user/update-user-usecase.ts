import { UserEntity } from '@/data/entities'
import { IncorrectPasswordError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface UpdateUserUseCase {
  update: (
    newUserData: UpdateUserUseCase.Params
  ) => Promise<UpdateUserUseCase.Response>
}

export namespace UpdateUserUseCase {
  export type Params = Omit<UserEntity, 'createdAt' | 'updatedAt'>
  export type Response = Either<
    IncorrectPasswordError,
    Omit<
      UserEntity,
      | 'password'
      | 'establishments'
      | 'accounts'
      | 'password'
      | 'pollVotes'
      | 'deletedAt'
    >
  >
}
