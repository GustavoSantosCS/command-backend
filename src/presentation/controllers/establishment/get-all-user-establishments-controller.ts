import { EstablishmentModel } from '@/domain/models';
import { GetAlUserEstablishmentsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class GetAllUserEstablishmentsController implements Controller {
  constructor(
    private readonly getEstablishmentsOfUser: GetAlUserEstablishmentsUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest<GetAllUserEstablishmentsController.Params>
  ): Promise<HttpResponse<GetAllUserEstablishmentsController.Response>> {
    const response =
      await this.getEstablishmentsOfUser.getAllEstablishmentsUser(
        httpRequest.body.authenticated.id
      );
    if (response.isLeft()) return serverError(response.value);
    return ok(response.value);
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllUserEstablishmentsController {
  export type Params = {
    authenticated: {
      id: string;
    };
  };

  export type Response = {
    establishments: Omit<EstablishmentModel, 'manager'>[];
  };
}
