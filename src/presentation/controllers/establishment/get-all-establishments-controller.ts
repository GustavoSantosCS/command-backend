import { EstablishmentModel } from '@/domain/models';
import { GetAllEstablishmentsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class GetAllEstablishmentsController implements Controller {
  constructor(
    private readonly getAllEstablishmentsUseCase: GetAllEstablishmentsUseCase
  ) {}

  async handle(
    httpRequest: HttpRequest
  ): Promise<HttpResponse<GetAllEstablishmentsController.Response>> {
    try {
      const response =
        await this.getAllEstablishmentsUseCase.getAllEstablishments();

      return ok(response.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GetAllEstablishmentsController:25 => ', error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentsController {
  export type Response = {
    establishments: Omit<EstablishmentModel, 'manager'>[];
  };
}
