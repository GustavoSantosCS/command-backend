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

      const establishment: any = response.value;
      delete establishment.manager;

      return ok(establishment);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
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
