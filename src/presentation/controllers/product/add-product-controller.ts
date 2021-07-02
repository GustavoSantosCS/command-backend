import { ImagePersistenceData, ProductModel } from '@/domain/models';
import { AddProductUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddProductController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addProductUseCase: AddProductUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<AddProductController.Params>
  ): Promise<HttpResponse<AddProductController.Response>> {
    try {
      const { body } = httpRequest;
      const resultValidator = this.validator.validate({
        name: body?.name,
        description: body?.description,
        price: parseFloat(body?.price),
        establishmentId: body?.establishmentId
      });

      if (resultValidator.isLeft()) return badRequest(resultValidator.value);

      const usecaseResponse = await this.addProductUseCase.save({
        idUser: body.authenticated.id,
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        establishmentId: body.establishmentId,
        productImage: body.productImage
      });

      if (usecaseResponse.isLeft()) return badRequest(usecaseResponse.value);

      return ok(usecaseResponse.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AddProductController:45 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddProductController {
  export type Params = {
    authenticated: {
      id: string;
    };
    name: string;
    description: string;
    price: string;
    establishmentId: string;
    productImage: ImagePersistenceData;
  };

  export type Response = ProductModel;
}
