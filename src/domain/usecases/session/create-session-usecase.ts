import { UserModel } from '@/domain/models';
import { LoginError } from '@/presentation/errors/login-error';
import { Either } from '@/shared/either';

export interface CreateSessionUseCase {
  createSession(
    data: CreateSessionUseCase.Params
  ): Promise<CreateSessionUseCase.Result>;
}
// eslint-disable-next-line no-redeclare
export namespace CreateSessionUseCase {
  export type Params = { email: string; password: string };

  export type Result = Either<
    LoginError,
    {
      token: string;
      user: Omit<UserModel, 'password'>;
    }
  >;
}
