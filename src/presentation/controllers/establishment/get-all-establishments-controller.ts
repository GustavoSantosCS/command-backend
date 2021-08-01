import { EstablishmentEntity } from '@/data/entities'
import { GetAllEstablishmentsUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http'

export class GetAllEstablishmentsController implements Controller {
  private readonly getAllEstablishments: GetAllEstablishmentsUseCase

  constructor(getAllEstablishmentsUseCase: GetAllEstablishmentsUseCase) {
    this.getAllEstablishments = getAllEstablishmentsUseCase
  }

  async handle(
    httpRequest: HttpRequest<null, null>
  ): Promise<HttpResponse<GetAllEstablishmentsController.Response>> {
    try {
      const establishments = await this.getAllEstablishments.getAll()

      return ok(establishments)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetAllEstablishmentsController {
  export type Response = Array<Omit<EstablishmentEntity, 'manager'>>
}
