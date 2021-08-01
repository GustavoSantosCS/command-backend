import { UserEntity } from '@/data/entities'
import { AddUserUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'

export class AddUserController implements Controller {
  private readonly validator: Validator
  private readonly addUser: AddUserUseCase

  constructor(validator: Validator, addUserUseCase: AddUserUseCase) {
    this.validator = validator
    this.addUser = addUserUseCase
  }

  async handle(
    httpRequest: HttpRequest<AddUserController.DTO>
  ): Promise<HttpResponse<AddUserController.Response>> {
    try {
      const validation = this.validator.validate(httpRequest.body)
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }

      const { name, email, password } = httpRequest.body
      const resultAddUser = await this.addUser.save({
        name,
        email: email.toLowerCase(),
        password
      })

      if (resultAddUser.isLeft()) {
        return badRequest(resultAddUser.value)
      }

      const { value: newUserEntity } = resultAddUser
      const user: AddUserController.Response = {
        id: newUserEntity.id,
        name: newUserEntity.name,
        email: newUserEntity.email,
        createdAt: newUserEntity.createdAt,
        updatedAt: newUserEntity.updatedAt
      }

      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace AddUserController {
  export type DTO = {
    name: string
    email: string
    password: string
    confirmPassword: string
  }

  export type Response = Omit<
    UserEntity,
    'password' | 'avatar' | 'establishments'
  >
}
