import { RequestProductEntity } from '@/data/entities';
import { RequestProductModel } from '@/domain/models';
import { CreateRequestProductUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class CreateRequestProductController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly createRequestProductUseCase: CreateRequestProductUseCase
  ) {}
  async handle(
    httpRequest: HttpRequest<
      CreateRequestProductController.Body,
      CreateRequestProductController.Param
    >
  ): Promise<HttpResponse<CreateRequestProductController.Result>> {
    try {
      const { body, params } = httpRequest;
      const resultValidator = this.validator.validate({
        idProduct: body?.idProduct,
        obs: body?.obs,
        total: parseFloat(body?.total),
        amountOfProduct: parseInt(body?.amountOfProduct),
        idAccount: params.idAccount
      });

      if (resultValidator.isLeft()) return badRequest(resultValidator.value);

      const result =
        await this.createRequestProductUseCase.createRequestProduct({
          idProduct: body?.idProduct,
          idAccount: params.idAccount,
          obs: body?.obs,
          total: parseFloat(body?.total),
          amountOfProduct: parseInt(body?.amountOfProduct)
        });

      if (result.isLeft()) return badRequest(result.value);

      return ok(result.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('CreateRequestProductController:45 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace CreateRequestProductController {
  export type Body = {
    authenticated: {
      id: string;
    };
    idProduct: string;
    obs: string;
    total: string;
    amountOfProduct: string;
  };

  export type Param = {
    idAccount: string;
  };

  export type Result = RequestProductModel;
}
