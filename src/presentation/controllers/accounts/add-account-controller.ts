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

    this.addAccountUseCase.add(body);
    return null;
  }
}
