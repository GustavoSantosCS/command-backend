import { EstablishmentEntity } from '@/data/entities';
import { GetAllEstablishmentsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class GetAllEstablishmentsController implements Controller {
  private readonly getAllEstablishments: GetAllEstablishmentsUseCase;

  constructor(getAllEstablishmentsUseCase: GetAllEstablishmentsUseCase) {
    this.getAllEstablishments = getAllEstablishmentsUseCase;
  }

  async handle(
    httpRequest: HttpRequest<null, null>
  ): Promise<HttpResponse<GetAllEstablishmentsController.Response>> {
    try {
      const establishments = await this.getAllEstablishments.getAll();

      return ok(establishments);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentsController {
  export type Response = Omit<EstablishmentEntity, 'manager'>[];
}
