import { UserModel } from '@/domain/models';
import {
  CreateSessionUseCase,
  GetAuthenticatedUserUseCase
} from '@/domain/usecases';

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok } from '@/utils/http';

export class GetAuthenticatedUserController implements Controller {
  constructor(
    private readonly getAuthenticatedUserUsecase: GetAuthenticatedUserUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<GetAuthenticatedUserController.Params>
  ): Promise<HttpResponse<GetAuthenticatedUserController.Response>> {
    const revalidateUser = await this.getAuthenticatedUserUsecase.getUser(
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
export namespace GetAuthenticatedUserController {
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
