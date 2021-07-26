import { EstablishmentModel } from '@/domain/models';
import { GetUserEstablishmentByIdUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { AppError } from '@/shared/errors';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetUserEstablishmentByIdController implements Controller {
  constructor(
    private readonly getUserEstablishmentByIdUsecase: GetUserEstablishmentByIdUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<GetUserEstablishmentByIdController.DTO>
  ): Promise<HttpResponse<GetUserEstablishmentByIdController.Response>> {
    try {
      const { id: userId } = httpRequest.body.authenticated;
      const { id: idEstablishment } = httpRequest.params;
      const response =
        await this.getUserEstablishmentByIdUsecase.getUserEstablishmentById(
          userId,
          idEstablishment
        );

      if (response.isLeft())
        return badRequest(
          new AppError('Não foi possível encontro o estabelecimento')
        );

      const establishment: Omit<EstablishmentModel, 'manager'> = {
        id: response.value.id,
        name: response.value.name,
        description: response.value.description,
        category: response.value.category,
        isOpen: response.value.isOpen,
        image: response.value.image,
        createdAt: response.value.createdAt,
        updatedAt: response.value.updatedAt
      };

      return ok(establishment);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetUserEstablishmentByIdController:47 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetUserEstablishmentByIdController {
  export type DTO = {
    authenticated: {
      id: string;
    };
  };

  export type Response = Omit<EstablishmentModel, 'manager'>;
}
