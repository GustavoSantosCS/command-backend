import { UserModel } from '@/domain/models';
import { CreateSessionUseCase } from '@/domain/usecases/session';
import { RevalidateUserUseCase } from '@/domain/usecases/user';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok } from '@/utils/http';

export class RevalidateUserController implements Controller {
  constructor(private readonly revalidateUserUseCase: RevalidateUserUseCase) {}

  async handle(
    httpRequest: HttpRequest<RevalidateUserController.Params>
  ): Promise<HttpResponse<RevalidateUserController.Response>> {
    const revalidateUser = await this.revalidateUserUseCase.getUser(
      httpRequest.body.authenticated.id
    );

    if (revalidateUser.isLeft()) {
      return badRequest(revalidateUser.value);
    }

    const user: UserModel = revalidateUser.value;

    delete user.id;
    delete user.password;

    return ok(user);
  }
}

// eslint-disable-next-line no-redeclare
export namespace RevalidateUserController {
  export type Params = {
    authenticated: {
      id: string;
    };
  };

  export type Response = {
    token: string;
    user: Omit<UserModel, 'id' | 'password'>;
  };
}
