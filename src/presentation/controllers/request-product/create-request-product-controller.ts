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
  private readonly validator: Validator;
  private readonly createRequestProduct: CreateRequestProductUseCase;

  constructor(
    validator: Validator,
    createRequestProductUseCase: CreateRequestProductUseCase
  ) {
    this.validator = validator;
    this.createRequestProduct = createRequestProductUseCase;
  }

  async handle(
    httpRequest: HttpRequest<
      CreateRequestProductController.DTOBody,
      CreateRequestProductController.DTOParam
    >
  ): Promise<HttpResponse<CreateRequestProductController.Response>> {
    try {
      const { body, params } = httpRequest;
      const resultValidator = this.validator.validate({
        productId: body.productId,
        obs: body.obs,
        total: parseFloat(body.total),
        amountOfProduct: parseInt(body.amountOfProduct),
        accountId: params.accountId
      });

      if (resultValidator.isLeft()) {
        return badRequest(resultValidator.value);
      }

      const resultCreate = await this.createRequestProduct.createRequestProduct(
        {
          productId: body?.productId,
          accountId: params.accountId,
          obs: body?.obs,
          total: parseFloat(body?.total),
          amountOfProduct: parseInt(body?.amountOfProduct)
        }
      );

      if (resultCreate.isLeft()) {
        return badRequest(resultCreate.value);
      }

      const { value } = resultCreate;
      const newRequestProduct: CreateRequestProductController.Response = {
        id: value.id,
        product: value.product,
        amountOfProduct: value.amountOfProduct,
        total: value.total,
        obs: value.obs,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
      };

      return ok(newRequestProduct);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('CreateRequestProductController:71 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace CreateRequestProductController {
  export type DTOBody = {
    authenticated: {
      id: string;
    };
    productId: string;
    obs: string;
    total: string;
    amountOfProduct: string;
  };

  export type DTOParam = {
    accountId: string;
  };

  export type Response = Omit<RequestProductModel, 'account' | 'closedAt'>;
}
