import { EstablishmentEntity, EstablishmentImageEntity } from '@/data/entities'
import { CATEGORY } from '@/domain/models'

import { AddEstablishmentUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { Validator } from '@/validation/protocols'

export class AddEstablishmentController implements Controller {
  private readonly validator: Validator
  private readonly addEstablishment: AddEstablishmentUseCase

  constructor(
    validator: Validator,
    addEstablishmentUseCase: AddEstablishmentUseCase
  ) {
    this.validator = validator
    this.addEstablishment = addEstablishmentUseCase
  }

  async handle(
    httpRequest: HttpRequest<AddEstablishmentController.DTO>
  ): Promise<HttpResponse<AddEstablishmentController.Response>> {
    const { body } = httpRequest
    const validation = this.validator.validate({
      name: body.name,
      category: body.category,
      description: body.description
    })
    if (validation.isLeft()) {
      return badRequest(validation.value)
    }

    try {
      const newEstablishment = await this.addEstablishment.add({
        userId: body.authenticated.id,
        establishment: {
          name: body.name,
          category: body.category,
          description: body.description
        },
        establishmentImage: body.establishmentImage
      })

      return ok(newEstablishment)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace AddEstablishmentController {
  export type DTO = {
    authenticated: {
      id: string
    }
    name: string
    category: CATEGORY
    description: string
    establishmentImage: EstablishmentImageEntity
  }

  export type Response = Omit<EstablishmentEntity, 'manager'>
}
