import { EstablishmentEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { GetUserEstablishmentByIdUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

export class GetUserEstablishmentByIdController implements Controller {
  private readonly getUserEstablishment: GetUserEstablishmentByIdUseCase

  constructor(getUserEstablishment: GetUserEstablishmentByIdUseCase) {
    this.getUserEstablishment = getUserEstablishment
  }

  async handle(
    httpRequest: HttpRequest<
      GetUserEstablishmentByIdController.DTO,
      GetUserEstablishmentByIdController.Param
    >
  ): Promise<HttpResponse<GetUserEstablishmentByIdController.Response>> {
    try {
      const { id: userId } = httpRequest.body.authenticated
      const { establishmentId } = httpRequest.params

      const response = await this.getUserEstablishment.getUserEstablishmentById(
        userId,
        establishmentId
      )

      if (response.isLeft()) {
        return badRequest(new EstablishmentNotFoundError())
      }

      const establishment: GetUserEstablishmentByIdController.Return = {
        id: response.value.id,
        name: response.value.name,
        description: response.value.description,
        category: response.value.category,
        isOpen: response.value.isOpen,
        image: response.value.image,
        createdAt: response.value.createdAt,
        updatedAt: response.value.updatedAt
      }

      return ok(establishment)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetUserEstablishmentByIdController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Param = {
    establishmentId: string
  }

  export type Return = Omit<
    EstablishmentEntity,
    | 'manager'
    | 'products'
    | 'playlists'
    | 'accounts'
    | 'surveys'
    | 'musics'
    | 'deletedAt'
  >

  export type Response = Return
}
