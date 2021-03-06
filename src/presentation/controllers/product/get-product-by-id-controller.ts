import { ProductEntity } from '@/data/entities'
import { GetProductByIdUseCase } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

export class GetProductByIdController implements Controller {
  private readonly getProductById: GetProductByIdUseCase

  constructor(getProductById: GetProductByIdUseCase) {
    this.getProductById = getProductById
  }

  async handle(
    httpRequest: HttpRequest<
      GetProductByIdController.DTO,
      GetProductByIdController.Params
    >
  ): Promise<HttpResponse<GetProductByIdController.Response>> {
    try {
      const { id } = httpRequest.params
      const result = await this.getProductById.getById(id)
      if (result.isLeft()) return badRequest(result.value)

      const { value } = result
      const product: GetProductByIdController.Response = {
        id: value.id,
        description: value.description,
        isAvailable: value.isAvailable,
        name: value.name,
        price: value.price,
        image: value.image,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
      }

      return ok(product)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace GetProductByIdController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Params = {
    id: string
  }

  export type Response = Omit<ProductEntity, 'establishment' | 'deletedAt'>
}
