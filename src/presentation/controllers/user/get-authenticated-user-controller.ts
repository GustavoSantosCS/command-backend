import { UserEntity } from '@/data/entities'
import { GetAuthenticatedUserUseCase } from '@/domain/usecases'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/utils/http'

export class GetAuthenticatedUserController implements Controller {
  private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase
  constructor (getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase) {
    this.getAuthenticatedUser = getAuthenticatedUserUseCase
  }

  async handle (
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

      const { value: user } = resultRevalidate
      const result: GetAuthenticatedUserController.Response = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      return ok(result)
    } catch (error) {
      return serverError()
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAuthenticatedUserController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Response = Omit<UserEntity, 'password' | 'establishments'>
}
