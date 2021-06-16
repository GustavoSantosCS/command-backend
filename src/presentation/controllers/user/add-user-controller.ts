import { UserModel } from '@/domain/models';
import { AddUserUseCase } from '@/domain/usecases/user';
import { InternalServerError } from '@/presentation/errors';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddUserController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addUserUseCase: AddUserUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<AddUserController.Params>
  ): Promise<HttpResponse<AddUserController.Response>> {
    try {
      const { body } = httpRequest;

      const validatorResult = this.validator.validate(body);
      if (validatorResult.isLeft()) {
        return badRequest(validatorResult.value);
      }

      const resultAddUser = await this.addUserUseCase.add(body);
      if (resultAddUser.isLeft()) {
        if (resultAddUser.value.name === 'PersistencyError') {
          // eslint-disable-next-line no-console
          console.error(resultAddUser.value);
          return serverError(new InternalServerError());
        }
        return badRequest(resultAddUser.value);
      }

      const user: any = resultAddUser.value;
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
export namespace AddUserController {
  export type Params = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  export type Response = {
    user?: Omit<UserModel, 'password'>;
  };
}
