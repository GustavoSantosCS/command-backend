import { EstablishmentEntity } from '@/data/entities';
import { GetAllUserEstablishmentsUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class GetAllUserEstablishmentsController implements Controller {
  private readonly getEstablishmentsOfUser: GetAllUserEstablishmentsUseCase;

  constructor(getEstablishmentsOfUserUseCase: GetAllUserEstablishmentsUseCase) {
    this.getEstablishmentsOfUser = getEstablishmentsOfUserUseCase;
  }

  async handle(
    httpRequest: HttpRequest<GetAllUserEstablishmentsController.DTO>
  ): Promise<HttpResponse<GetAllUserEstablishmentsController.Response>> {
    try {
      const establishments =
        await this.getEstablishmentsOfUser.getAllEstablishmentsUser(
          httpRequest.body.authenticated.id
        );

      return ok(establishments);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError(error);
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllUserEstablishmentsController {
  export type DTO = {
    authenticated: {
      id: string;
    };
  };

  export type Response = Omit<EstablishmentEntity, 'manager'>[];
}
