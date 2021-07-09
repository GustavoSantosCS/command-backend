import { AccountModel } from '@/domain/models';
import { CreateAccountUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class CreateAccountController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly createAccountUseCase: CreateAccountUseCase
  ) {}
  async handle(
    httpRequest: HttpRequest<CreateAccountController.DTO>
  ): Promise<HttpResponse<CreateAccountController.Result>> {
    try {
      const {
        authenticated: { id: idUser },
        establishmentId
      } = httpRequest.body;
      const validatorResult = this.validator.validate({
        establishmentId
      });

      if (validatorResult.isLeft()) {
        return badRequest(validatorResult.value);
      }

      const result = await this.createAccountUseCase.create({
        idUser,
        establishmentId
      });

      if (result.isLeft()) {
        return badRequest(result.value);
      }

      const newAccount: Omit<AccountModel, 'client' | 'establishment'> = {
        id: result.value.id,
        requestsMusic: [],
        requestsProduct: [],
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt
      };

      return ok(newAccount);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('CreateAccountController:52 => ', error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace CreateAccountController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    establishmentId: string;
  };

  export type Result = Omit<AccountModel, 'user' | 'establishment'>;
}
