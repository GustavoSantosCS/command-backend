import { AddAccountUseCase } from '@/domain/usecases/account';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { Validator } from '@/validator/protocols';

export class AddAccountController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addAccountUseCase: AddAccountUseCase
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const validatorResult = this.validator.validate(body);
      if (validatorResult.isLeft()) {
        return {
          statusCode: 400,
          body: {
            errors: validatorResult.value.map(error => ({
              message: error.message,
              value: error.value
            }))
          }
        };
      }

      const resultAddAccount = await this.addAccountUseCase.add(body);

      if (resultAddAccount.isLeft()) {
        const { value: error } = resultAddAccount;
        return {
          statusCode: 400,
          body: {
            errors: [
              {
                message: error.message,
                value: error.email
              }
            ]
          }
        };
      }

      return {
        statusCode: 200,
        body: resultAddAccount.value
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          errors: [
            {
              message: error.message
            }
          ]
        }
      };
    }
  }
}