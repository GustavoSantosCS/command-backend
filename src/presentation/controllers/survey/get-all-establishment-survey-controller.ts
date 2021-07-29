import { SurveyEntity } from '@/data/entities';
import { GetAllEstablishmentSurveyUseCase } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { ok, serverError } from '@/utils/http';

export class GetAllEstablishmentSurveyController implements Controller {
  private usecase: GetAllEstablishmentSurveyUseCase;

  constructor(usecase: GetAllEstablishmentSurveyUseCase) {
    this.usecase = usecase;
  }

  async handle(
    httpRequest: HttpRequest<
      GetAllEstablishmentSurveyController.DTO,
      GetAllEstablishmentSurveyController.Param
    >
  ): Promise<HttpResponse<GetAllEstablishmentSurveyController.Response>> {
    try {
      const { establishmentId } = httpRequest.params;
      const establishments = await this.usecase.getAll(establishmentId);
      return ok(establishments.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError();
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentSurveyController {
  export type DTO = {
    authenticated: {
      id: string;
    };
  };
  export type Param = {
    establishmentId: string;
  };

  export type Response = SurveyEntity[];
}
