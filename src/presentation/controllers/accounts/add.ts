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
    this.validator.validate(body);
    return null;
  }
}
