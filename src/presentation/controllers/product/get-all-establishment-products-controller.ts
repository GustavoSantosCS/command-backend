import { ProductModel } from '@/domain/models';
import { GetAllEstablishmentProductsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetAllEstablishmentProductsController implements Controller {
  private readonly getAllEstablishmentProducts: GetAllEstablishmentProductsUseCase;

  constructor(getAllEstablishmentProducts: GetAllEstablishmentProductsUseCase) {
    this.getAllEstablishmentProducts = getAllEstablishmentProducts;
  }

  async handle(
    httpRequest: HttpRequest<
      GetAllEstablishmentProductsController.DTOBody,
      GetAllEstablishmentProductsController.DTOParams
    >
  ): Promise<HttpResponse<GetAllEstablishmentProductsController.DTOBody>> {
    try {
      const idEstablishment = httpRequest.params.id;

      const resultGetAll =
        await this.getAllEstablishmentProducts.getAllEstablishmentProducts(
          idEstablishment
        );
      if (resultGetAll.isLeft()) {
        return badRequest(resultGetAll.value);
      }

      const { value: productsEntity } = resultGetAll;
      const products: GetAllEstablishmentProductsController.Response =
        productsEntity.map(product => ({
          id: product.id,
          description: product.description,
          isAvailable: product.isAvailable,
          name: product.name,
          price: product.price,
          image: product.image,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
      return ok(products);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetAllEstablishmentProductsController:51 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentProductsController {
  export type DTOBody = {
    authenticated: {
      id: string;
    };
  };

  export type DTOParams = {
    id: string;
  };

  export type Response = Omit<ProductModel, 'establishment'>[];
}
