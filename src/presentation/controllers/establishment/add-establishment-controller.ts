import {
  EstablishmentImageModel,
  CATEGORY,
  EstablishmentModel
} from '@/domain/models';

import { AddEstablishmentUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

export class AddEstablishmentController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addEstablishmentUseCase: AddEstablishmentUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<AddEstablishmentController.Params>
  ): Promise<HttpResponse<AddEstablishmentController.Response>> {
    const { body } = httpRequest;

    const validatorResult = this.validator.validate({
      name: body.name,
      category: body.category,
      description: body.description
    });

    if (validatorResult.isLeft()) {
      return badRequest(validatorResult.value);
    }

    try {
      const response = await this.addEstablishmentUseCase.addEstablishment({
        userId: body.authenticated.id,
        establishment: {
          name: body.name,
          category: body.category,
          description: body.description
        },
        establishmentImage: body.establishmentImage
      });

      if (response.isLeft()) {
        return badRequest(response.value);
      }

      const establishment: EstablishmentModel = response.value;

      delete establishment.manager;

      return ok(establishment);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddEstablishmentController {
  export type Params = {
    authenticated: {
      id: string;
    };
    name: string;
    category: CATEGORY;
    description: string;
    establishmentImage: EstablishmentImageModel;
  };

  export type Response = EstablishmentModel;
}
