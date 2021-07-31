import { SurveyEntity } from '@/data/entities'
import { GetSurveyByIdUseCase } from '@/domain/usecases'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/utils/http'

export class GetSurveyByIdController implements Controller {
  private readonly getSurveyById: GetSurveyByIdUseCase

  constructor (getSurveyById: GetSurveyByIdUseCase) {
    this.getSurveyById = getSurveyById
  }

  async handle (
    httpRequest: HttpRequest<
    GetSurveyByIdController.DTO,
    GetSurveyByIdController.Param
    >
  ): Promise<GetSurveyByIdController.Response> {
    try {
      const { surveyId } = httpRequest.params
      const result = await this.getSurveyById.getById(surveyId)
      if (result.isLeft()) {
        return badRequest(result.value)
      }
      return ok(result.value)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return serverError()
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetSurveyByIdController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }
  export type Param = {
    surveyId: string
  }

  export type Response = HttpResponse<SurveyEntity>
}
