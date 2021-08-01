import { SurveyEntity } from '@/data/entities'
import { CloseSurveyUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

export class CloseSurveyController implements Controller {
  private readonly closeSurvey: CloseSurveyUseCase

  constructor(closeSurvey: CloseSurveyUseCase) {
    this.closeSurvey = closeSurvey
  }

  async handle(
    httpRequest: HttpRequest<
      CloseSurveyController.DTO,
      CloseSurveyController.Param
    >
  ): Promise<CloseSurveyController.Response> {
    try {
      const resultUsecase = await this.closeSurvey.close(
        httpRequest.params.surveyId,
        httpRequest.body.authenticated.id
      )

      if (resultUsecase.isLeft()) return badRequest(resultUsecase.value)

      return ok(resultUsecase.value)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace CloseSurveyController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Param = {
    surveyId: string
  }

  export type Response = HttpResponse<Omit<SurveyEntity, 'establishment'>>
}
