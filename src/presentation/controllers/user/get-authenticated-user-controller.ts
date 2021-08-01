import { UserEntity } from '@/data/entities'
import { GetAuthenticatedUserUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

export class GetAuthenticatedUserController implements Controller {
  private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase
  constructor(getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase) {
    this.getAuthenticatedUser = getAuthenticatedUserUseCase
  }

  async handle(
    httpRequest: HttpRequest<GetAuthenticatedUserController.DTO>
  ): Promise<HttpResponse<GetAuthenticatedUserController.Response>> {
    try {
      const resultRevalidate =
        await this.getAuthenticatedUser.getAuthenticatedUser(
          httpRequest.body.authenticated.id
        )
      if (resultRevalidate.isLeft()) {
        return badRequest(resultRevalidate.value)
      }

      return ok(resultRevalidate.value)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetAuthenticatedUserController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Response = Omit<UserEntity, 'password' | 'establishments'>
}
