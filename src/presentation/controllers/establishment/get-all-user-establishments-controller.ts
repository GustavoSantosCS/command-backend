import { EstablishmentEntity } from '@/data/entities'
import { GetAllUserEstablishmentsUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http'

export class GetAllUserEstablishmentsController implements Controller {
  private readonly getEstablishmentsOfUser: GetAllUserEstablishmentsUseCase

  constructor(getEstablishmentsOfUserUseCase: GetAllUserEstablishmentsUseCase) {
    this.getEstablishmentsOfUser = getEstablishmentsOfUserUseCase
  }

  async handle(
    httpRequest: HttpRequest<GetAllUserEstablishmentsController.DTO>
  ): Promise<HttpResponse<GetAllUserEstablishmentsController.Response>> {
    try {
      const establishments =
        await this.getEstablishmentsOfUser.getAllEstablishmentsUser(
          httpRequest.body.authenticated.id
        )

      return ok(establishments)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetAllUserEstablishmentsController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Response = Array<Omit<EstablishmentEntity, 'manager'>>
}
