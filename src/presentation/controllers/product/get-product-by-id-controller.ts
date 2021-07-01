import { ProductModel } from '@/domain/models';
import { GetProductByIdUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetProductByIdController implements Controller {
  constructor(private readonly getProductById: GetProductByIdUseCase) {}

  async handle(
    httpRequest: HttpRequest<
      GetProductByIdController.Body,
      GetProductByIdController.Params
    >
  ): Promise<HttpResponse<GetProductByIdController.Response>> {
    try {
      const { id: idUser } = httpRequest.body.authenticated;
      const { id: idProduct } = httpRequest.params;

      const response = await this.getProductById.getById(idUser, idProduct);

      if (response.isLeft()) return badRequest(response.value);

      delete response.value.establishment;
      return ok(response.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetProductByIdController {
  export type Body = {
    authenticated: {
      id: string;
    };
    establishmentId: string;
  };

  export type Params = {
    id: string;
  };

  export type Response = Omit<ProductModel, 'establishment'>;
}
