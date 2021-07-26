import { UserModel } from '@/domain/models';
import { CreateSessionUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class CreateSessionController implements Controller {
  private readonly validator: Validator;
  private readonly createSession: CreateSessionUseCase;

  constructor(validator: Validator, createSession: CreateSessionUseCase) {
    this.validator = validator;
    this.createSession = createSession;
  }

  async handle(
    httpRequest: HttpRequest<CreateSessionController.DTO>
  ): Promise<HttpResponse<CreateSessionController.Response>> {
    try {
      const { body } = httpRequest;
      const validation = this.validator.validate(body);
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const resultCreateSession = await this.createSession.createSession({
        email: body.email.toLowerCase(),
        password: body.password
      });
      if (resultCreateSession.isLeft()) {
        return badRequest(resultCreateSession.value);
      }

      const { token, user } = resultCreateSession.value;
      const session: CreateSessionController.Response = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      };
      return ok(session);
    } catch (error) {
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace CreateSessionController {
  export type DTO = {
    email: string;
    password: string;
  };

  export type Response = {
    token: string;
    user: Omit<UserModel, 'password' | 'establishments'>;
  };
}
