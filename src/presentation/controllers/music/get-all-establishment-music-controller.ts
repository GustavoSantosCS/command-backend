import { MusicModel } from '@/domain/models';
import { GetAllEstablishmentMusicsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/utils/http';

export class GetAllEstablishmentMusicsController implements Controller {
  private readonly getAllEstablishmentMusics: GetAllEstablishmentMusicsUseCase;

  constructor(
    getAllEstablishmentMusicsUseCase: GetAllEstablishmentMusicsUseCase
  ) {
    this.getAllEstablishmentMusics = getAllEstablishmentMusicsUseCase;
  }

  async handle(
    httpRequest: HttpRequest<
      GetAllEstablishmentMusicsController.DTOBody,
      GetAllEstablishmentMusicsController.DTOParams
    >
  ): Promise<HttpResponse<GetAllEstablishmentMusicsController.DTOBody>> {
    try {
      const idEstablishment = httpRequest.params.id;

      const response =
        await this.getAllEstablishmentMusics.getAllEstablishmentMusics(
          idEstablishment
        );

      if (response.isLeft()) return badRequest(response.value);
      return ok(response.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetAllEstablishmentMusicsController:37 => ', error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentMusicsController {
  export type DTOBody = {
    authenticated: {
      id: string;
    };
  };

  export type DTOParams = {
    id: string;
  };

  export type Response = Omit<MusicModel, 'establishment'>[];
}
