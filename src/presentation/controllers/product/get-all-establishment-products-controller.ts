import { ProductModel } from '@/domain/models';
import { GetAllEstablishmentProductsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetAllEstablishmentProductsController implements Controller {
  constructor(
    private readonly getAllEstablishmentProducts: GetAllEstablishmentProductsUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<
      GetAllEstablishmentProductsController.Body,
      GetAllEstablishmentProductsController.Params
    >
  ): Promise<HttpResponse<GetAllEstablishmentProductsController.Body>> {
    try {
      const idUser = httpRequest.body.authenticated.id;
      const idEstablished = httpRequest.params.id;

      const response =
        await this.getAllEstablishmentProducts.getAllEstablishmentProducts(
          idUser,
          idEstablished
        );

      if (response.isLeft()) return badRequest(response.value);
      return ok(response.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentProductsController {
  export type Body = {
    authenticated: {
      id: string;
    };
  };

  export type Params = {
    id: string;
  };

  export type Response = Omit<ProductModel, 'establishment'>[];
}
