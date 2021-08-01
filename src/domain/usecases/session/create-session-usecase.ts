import { FailedLoginError } from '@/domain/errors'
import { Either } from '@/shared/either'
import { UserEntity } from '@/data/entities'

export interface CreateSessionUseCase {
  createSession: (
    userData: CreateSessionUseCase.Params
  ) => Promise<CreateSessionUseCase.Result>
}

export namespace CreateSessionUseCase {
  export type Params = {
    email: string
    password: string
  }

  export type Return = {
    token: string
    user: Omit<UserEntity, 'password'>
  }

  export type Result = Either<FailedLoginError, Return>
}
