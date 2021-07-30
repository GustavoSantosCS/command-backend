import { RequestProductEntity } from '@/data/entities';
import { CreateRequestProductUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddRequestProductController implements Controller {
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
      AddRequestProductController.DTO,
      AddRequestProductController.Param
    >
  ): Promise<HttpResponse<AddRequestProductController.Response>> {
    try {
      const { accountId, amountOfProduct, obs, productId, total } =
        httpRequest.body;
      const { id: userId } = httpRequest.body.authenticated;
      const resultValidator = this.validator.validate({
        productId,
        obs,
        total: parseFloat(total),
        amountOfProduct: parseInt(amountOfProduct),
        accountId
      });

      if (resultValidator.isLeft()) {
        return badRequest(resultValidator.value);
      }

      const resultCreate = await this.createRequestProduct.add({
        userId,
        productId,
        accountId,
        obs,
        total: parseFloat(total),
        amountOfProduct: parseInt(amountOfProduct)
      });

      if (resultCreate.isLeft()) {
        return badRequest(resultCreate.value);
      }

      const { value } = resultCreate;
      delete value.product.establishment;
      const newRequestProduct: AddRequestProductController.Response = {
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
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddRequestProductController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    productId: string;
    obs: string;
    total: string;
    amountOfProduct: string;
    accountId: string;
  };

  export type Param = null;

  export type Response = Omit<RequestProductEntity, 'account' | 'closedAt'>;
}
