import { ProductModel } from '@/domain/models';
import { GetProductByIdUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetProductByIdController implements Controller {
  private readonly getProductById: GetProductByIdUseCase;

  constructor(getProductById: GetProductByIdUseCase) {
    this.getProductById = getProductById;
  }

  async handle(
    httpRequest: HttpRequest<
      GetProductByIdController.DTOBody,
      GetProductByIdController.DTOParams
    >
  ): Promise<HttpResponse<GetProductByIdController.Response>> {
    try {
      const { id } = httpRequest.params;
      const result = await this.getProductById.getById(id);
      if (result.isLeft()) return badRequest(result.value);

      const { value } = result;
      const product: GetProductByIdController.Response = {
        id: value.id,
        description: value.description,
        isAvailable: value.isAvailable,
        name: value.name,
        price: value.price,
        image: value.image,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
      };

      return ok(product);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetProductByIdController:31 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetProductByIdController {
  export type DTOBody = {
    authenticated: {
      id: string;
    };
  };

  export type DTOParams = {
    id: string;
  };

  export type Response = Omit<ProductModel, 'establishment'>;
}
