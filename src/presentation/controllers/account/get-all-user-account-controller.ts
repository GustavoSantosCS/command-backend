import { AccountEntity } from '@/data/entities'
import { GetAllUserAccountUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http'

export class GetAllUserAccountController implements Controller {
  private readonly getAllUserAccount: GetAllUserAccountUseCase

  constructor(getAllUserAccountUseCase: GetAllUserAccountUseCase) {
    this.getAllUserAccount = getAllUserAccountUseCase
  }

  async handle(
    httpRequest: HttpRequest<GetUserAccountController.DTO>
  ): Promise<HttpResponse<GetUserAccountController.Response>> {
    try {
      const { id: userId } = httpRequest.body.authenticated
      const accounts = await this.getAllUserAccount.getAllUserAccount(userId)
      return ok(accounts)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetUserAccountController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Response = Array<
    Omit<AccountEntity, 'client' | 'requestsProduct'>
  >
}
