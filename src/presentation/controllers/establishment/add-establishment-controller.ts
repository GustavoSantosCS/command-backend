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
  private readonly validator: Validator;
  private readonly addEstablishment: AddEstablishmentUseCase;

  constructor(
    validator: Validator,
    addEstablishmentUseCase: AddEstablishmentUseCase
  ) {
    this.validator = validator;
    this.addEstablishment = addEstablishmentUseCase;
  }

  async handle(
    httpRequest: HttpRequest<AddEstablishmentController.DTO>
  ): Promise<HttpResponse<AddEstablishmentController.Response>> {
    const { body } = httpRequest;
    const validation = this.validator.validate({
      name: body.name,
      category: body.category,
      description: body.description
    });
    if (validation.isLeft()) {
      return badRequest(validation.value);
    }

    try {
      const newEstablishment = await this.addEstablishment.addEstablishment({
        userId: body.authenticated.id,
        establishment: {
          name: body.name,
          category: body.category,
          description: body.description
        },
        establishmentImage: body.establishmentImage
      });

      return ok(newEstablishment);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AddEstablishmentController:55 => ', error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace AddEstablishmentController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    name: string;
    category: CATEGORY;
    description: string;
    establishmentImage: EstablishmentImageModel;
  };

  export type Response = Omit<EstablishmentModel, 'manager'>;
}
