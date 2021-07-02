import { MusicModel } from '@/domain/models';
import { GetAllEstablishmentMusicsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetAllEstablishmentMusicsController implements Controller {
  constructor(
    private readonly getAllEstablishmentMusics: GetAllEstablishmentMusicsUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<
      GetAllEstablishmentMusicsController.Body,
      GetAllEstablishmentMusicsController.Params
    >
  ): Promise<HttpResponse<GetAllEstablishmentMusicsController.Body>> {
    try {
      const idUser = httpRequest.body.authenticated.id;
      const idEstablished = httpRequest.params.id;

      const response =
        await this.getAllEstablishmentMusics.getAllEstablishmentMusics(
          idUser,
          idEstablished
        );

      if (response.isLeft()) return badRequest(response.value);
      return ok(response.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetAllEstablishmentMusicsController:35 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentMusicsController {
  export type Body = {
    authenticated: {
      id: string;
    };
  };

  export type Params = {
    id: string;
  };

  export type Response = Omit<MusicModel, 'establishment'>[];
}
