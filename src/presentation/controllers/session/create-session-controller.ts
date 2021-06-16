import { UserModel } from '@/domain/models';
import { CreateSessionUseCase } from '@/domain/usecases/session';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class CreateSessionController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly createSession: CreateSessionUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateSessionController.Params>
  ): Promise<HttpResponse<CreateSessionController.Result>> {
    try {
      const { body } = httpRequest;
      const validation = this.validator.validate(body);

      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const session = await this.createSession.createSession({
        email: body.email.toLowerCase(),
        password: body.password
      });
      if (session.isRight()) delete (session.value as any).user.password;

      return session.isRight() ? ok(session.value) : badRequest(session.value);
    } catch (error) {
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace CreateSessionController {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = {
    token: string;
    user: Omit<UserModel, 'password'>;
  };
}
