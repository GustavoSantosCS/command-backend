import { UserNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'
import { UserEntity } from '@/data/entities'

export interface GetAuthenticatedUserUseCase {
  getAuthenticatedUser: (
    userId: string
  ) => Promise<GetAuthenticatedUserUseCase.Result>
}

export namespace GetAuthenticatedUserUseCase {
  export type Return = Omit<
    UserEntity,
    'establishments' | 'accounts' | 'password' | 'pollVotes' | 'deletedAt'
  >
  export type Result = Either<UserNotFoundError, Return>
}
