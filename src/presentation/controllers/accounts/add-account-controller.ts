import { AddAccountUseCase } from '@/domain/usecases/account';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
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
        return badRequest(validatorResult.value);
      }
      const resultAddAccount = await this.addAccountUseCase.add(body);
      if (resultAddAccount.isLeft()) {
        return badRequest([resultAddAccount.value]);
      }
      return ok(resultAddAccount.value);
    } catch (error) {
      return serverError([error]);
    }
  }
}
