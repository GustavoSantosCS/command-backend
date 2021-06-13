import { AvatarModel, UserModel } from '@/domain/models';
import { UpdateUserUseCase } from '@/domain/usecases/user';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, notAuthorizedErro, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class UpdateUserController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly updateUserUsecase: UpdateUserUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<UpdateUserController.Params>
  ): Promise<HttpResponse<UpdateUserController.Response>> {
    const { body } = httpRequest;

    const validatorResult = this.validator.validate({
      nome: body.nome,
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
        nome: body.nome,
        email: body.email,
        password: body.password
      });

      if (response.isLeft()) {
        return badRequest(response.value);
      }

      const user: any = response.value;
      delete user.password;
      delete user.confirmPassword;
      delete user.deleteAt;
      delete user.updateAt;
      delete user.createdAt;

      return ok(user);
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
    nome: string;
    password: string;
    email: string;
    confirmPassword: string;
    authenticated: {
      id: string;
    };
  };

  export type Response = {
    id: string;
    nome: string;
    email: string;
    password: string;
    avatar?: AvatarModel;
  };
}
