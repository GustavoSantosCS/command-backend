import { ProductEntity } from '@/data/entities';
import { ImagePersistenceData } from '@/domain/models';
import { AddProductUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddProductController implements Controller {
  private readonly validator: Validator;
  private readonly addProduct: AddProductUseCase;

  constructor(validator: Validator, addProductUseCase: AddProductUseCase) {
    this.validator = validator;
    this.addProduct = addProductUseCase;
  }

  async handle(
    httpRequest: HttpRequest<AddProductController.DTO>
  ): Promise<HttpResponse<AddProductController.Response>> {
    try {
      const { body } = httpRequest;
      const validation = this.validator.validate({
        name: body?.name,
        description: body?.description,
        price: parseFloat(body?.price),
        establishmentId: body?.establishmentId
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const resultCreate = await this.addProduct.add({
        userId: body.authenticated.id,
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        establishmentId: body.establishmentId,
        productImage: body.productImage
      });

      if (resultCreate.isLeft()) {
        return badRequest(resultCreate.value);
      }

      const { value } = resultCreate;
      const newProduct: AddProductController.Response = {
        id: value.id,
        name: value.name,
        price: value.price,
        image: value.image,
        description: value.description,
        isAvailable: value.isAvailable,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
      };

      return ok(newProduct);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddProductController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    name: string;
    description: string;
    price: string;
    establishmentId: string;
    productImage: ImagePersistenceData;
  };

  export type Response = Omit<ProductEntity, 'establishment' | 'deletedAt'>;
}
