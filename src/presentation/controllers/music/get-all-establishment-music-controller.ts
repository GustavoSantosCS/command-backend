import { MusicEntity } from '@/data/entities'
import { GetAllEstablishmentMusicsUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

export class GetAllEstablishmentMusicsController implements Controller {
  private readonly getAllEstablishmentMusics: GetAllEstablishmentMusicsUseCase

  constructor(
    getAllEstablishmentMusicsUseCase: GetAllEstablishmentMusicsUseCase
  ) {
    this.getAllEstablishmentMusics = getAllEstablishmentMusicsUseCase
  }

  async handle(
    httpRequest: HttpRequest<
      GetAllEstablishmentMusicsController.DTO,
      GetAllEstablishmentMusicsController.Params
    >
  ): Promise<HttpResponse<GetAllEstablishmentMusicsController.DTO>> {
    try {
      const { establishmentId } = httpRequest.params

      const usecaseResult =
        await this.getAllEstablishmentMusics.getAllEstablishmentMusics(
          establishmentId
        )

      if (usecaseResult.isLeft()) return badRequest(usecaseResult.value)
      return ok(usecaseResult.value)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetAllEstablishmentMusicsController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Params = {
    establishmentId: string
  }

  export type Response = MusicEntity[]
}
