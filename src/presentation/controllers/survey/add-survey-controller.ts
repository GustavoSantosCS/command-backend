import { MusicEntity, SurveyEntity } from '@/data/entities';
import { AddSurveyUseCase } from '@/domain/usecases/survey';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { AppError } from '@/shared/errors';
import { badRequest, ok, serverError } from '@/utils/http';
import { Validator } from '@/validation/protocols';

// create a class for the add survey controller
export class AddSurveyController implements Controller {
  private validator: Validator;
  private addSurvey: AddSurveyUseCase;

  constructor(validator: Validator, addSurvey: AddSurveyUseCase) {
    this.validator = validator;
    this.addSurvey = addSurvey;
  }

  async handle(
    httpRequest: HttpRequest<AddSurveyController.DTO, null>
  ): Promise<HttpResponse<AddSurveyController.Response>> {
    try {
      const validation = this.validator.validate({
        question: httpRequest.body.question,
        establishmentId: httpRequest.body.establishmentId,
        musics: httpRequest.body.musics
      });
      if (validation.isLeft()) {
        return badRequest(validation.value);
      }

      const survey = await this.addSurvey.addSurvey({
        question: httpRequest.body.question,
        musics: httpRequest.body.musics,
        establishmentId: httpRequest.body.establishmentId,
        userId: httpRequest.body.authenticated.id
      });

      if (survey.isLeft()) {
        return badRequest(survey.value);
      }

      return ok(survey.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return serverError(error);
    }
  }
}

// create namespaces for the controllers
// eslint-disable-next-line no-redeclare
export namespace AddSurveyController {
  export type DTO = {
    authenticated: {
      id: string;
    };
    question: string;
    musics: { id: string }[];
    establishmentId: string;
  };

  export type Response = Omit<SurveyEntity, 'establishment'>;
}
