import { AddUserUseCase } from '@/domain/usecases/user';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddUserController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addUserUseCase: AddUserUseCase
  ) {}

  async handle(httpRequest: AddUserController.DTO): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const validatorResult = this.validator.validate(body);
      if (validatorResult.isLeft()) {
        return badRequest([validatorResult.value]);
      }
      const resultAddUser = await this.addUserUseCase.add(body);
      if (resultAddUser.isLeft()) {
        return badRequest([resultAddUser.value]);
      }
      return ok(resultAddUser.value);
    } catch (error) {
      return serverError([error]);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddUserController {
  export type DTO = {
    body: {
      confirmPassword: string;
    } & AddUserUseCase.DTO;
  };
}
