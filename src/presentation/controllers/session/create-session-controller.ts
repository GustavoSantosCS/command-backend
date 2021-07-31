import { UserEntity } from '@/data/entities';
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

      return ok({ token, user });
    } catch (error) {
      return serverError();
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
    user: Omit<
      UserEntity,
      'password' | 'establishments' | 'accounts' | 'pollVotes'
    >;
  };
}
