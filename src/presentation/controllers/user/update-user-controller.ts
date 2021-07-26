import { UserModel } from '@/domain/models';
import { UpdateUserUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class UpdateUserController implements Controller {
  private readonly validator: Validator;
  private readonly updateUser: UpdateUserUseCase;

  constructor(validator: Validator, updateUserUsecase: UpdateUserUseCase) {
    this.validator = validator;
    this.updateUser = updateUserUsecase;
  }

  async handle(
    httpRequest: HttpRequest<UpdateUserController.DTO>
  ): Promise<HttpResponse<UpdateUserController.Response>> {
    try {
      const { body } = httpRequest;
      const validation = this.validator.validate({
        name: body.name,
        email: body.email,
        password: body.password
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const resultUpdate = await this.updateUser.update({
        id: body.authenticated.id,
        name: body.name,
        email: body.email.toLowerCase(),
        password: body.password
      });
      if (resultUpdate.isLeft()) {
        return badRequest(resultUpdate.value);
      }
      const { value: user } = resultUpdate;

      const updateUser: UpdateUserController.Response = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      return ok(updateUser);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('UpdateUserController:56 => ', error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace UpdateUserController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    name: string;
    email: string;
    password: string;
  };

  export type Response = Omit<UserModel, 'password' | 'establishments'>;
}
