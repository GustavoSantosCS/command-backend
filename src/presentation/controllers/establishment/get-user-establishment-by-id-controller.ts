import { EstablishmentModel } from '@/domain/models';
import { GetUserEstablishedByIdUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { AppError } from '@/shared/app-error';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetUserEstablishedByIdController implements Controller {
  constructor(
    private readonly getUserEstablishedByIdUsecase: GetUserEstablishedByIdUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<GetUserEstablishedByIdController.Params>
  ): Promise<HttpResponse<GetUserEstablishedByIdController.Response>> {
    try {
      const { id: idUser } = httpRequest.body.authenticated;
      const { id: idEstablished } = httpRequest.params;
      const response =
        await this.getUserEstablishedByIdUsecase.getUserEstablishedById(
          idUser,
          idEstablished
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
      console.error('GetUserEstablishedByIdController:47 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetUserEstablishedByIdController {
  export type Params = {
    authenticated: {
      id: string;
    };
  };

  export type Response = Omit<EstablishmentModel, 'manager'>;
}
