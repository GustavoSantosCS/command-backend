import { AvatarModel, UserModel } from '@/domain/models';
import { CreateSessionUseCase } from '@/domain/usecases/session';
import { UpdateUserUseCase } from '@/domain/usecases/user';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class UpdateUserController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly updateUserUsecase: UpdateUserUseCase,
    private readonly createSession: CreateSessionUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<UpdateUserController.Params>
  ): Promise<HttpResponse<UpdateUserController.Response>> {
    const { body } = httpRequest;

    const validatorResult = this.validator.validate({
      name: body.name,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword
    });

    if (validatorResult.isLeft()) {
      return badRequest(validatorResult.value);
    }

    try {
      const response = await this.updateUserUsecase.update({
        id: body.authenticated.id,
        name: body.name,
        email: body.email.toLowerCase(),
        password: body.password
      });

      if (response.isLeft()) {
        return badRequest(response.value);
      }

      const session = await this.createSession.createSession({
        email: body.email.toLowerCase(),
        password: body.password
      });

      if (session.isRight()) delete (session.value as any).user.password;

      return session.isRight() ? ok(session.value) : badRequest(session.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserController {
  export type Params = {
    name: string;
    password: string;
    email: string;
    confirmPassword: string;
    authenticated: {
      id: string;
    };
  };

  export type Response = {
    token: string;
    user: Omit<UserModel, 'id' | 'password'>;
  };
}
