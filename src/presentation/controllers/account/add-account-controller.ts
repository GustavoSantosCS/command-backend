import { AccountEntity } from '@/data/entities'
import { CreateAccountUseCase } from '@/domain/usecases'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/utils/http'
import { Validator } from '@/validation/protocols'

export class CreateAccountController implements Controller {
  private readonly validator: Validator
  private readonly createAccount: CreateAccountUseCase

  constructor (
    validator: Validator,
    createAccountUseCase: CreateAccountUseCase
  ) {
    this.validator = validator
    this.createAccount = createAccountUseCase
  }

  async handle (
    httpRequest: HttpRequest<CreateAccountController.DTO>
  ): Promise<HttpResponse<CreateAccountController.Response>> {
    try {
      const {
        authenticated: { id: userId },
        establishmentId
      } = httpRequest.body
      const validation = this.validator.validate({
        establishmentId
      })

      if (validation.isLeft()) {
        return badRequest(validation.value)
      }

      const result = await this.createAccount.add({
        userId,
        establishmentId
      })

      if (result.isLeft()) {
        return badRequest(result.value)
      }

      const newAccount: CreateAccountController.Response = {
        id: result.value.id,
        requestsProduct: [],
        establishment: result.value.establishment,
        createdAt: result.value.createdAt,
        updatedAt: result.value.updatedAt
      }

      return ok(newAccount)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return serverError()
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace CreateAccountController {
  export type DTO = {
    authenticated: {
      id: string
    }
    establishmentId: string
  }

  export type Response = Omit<AccountEntity, 'client' | 'closedAt'>
}
