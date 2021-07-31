import { ProductEntity } from '@/data/entities'
import { GetAllEstablishmentProductsUseCase } from '@/domain/usecases'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/utils/http'

export class GetAllEstablishmentProductsController implements Controller {
  private readonly getAllEstablishmentProducts: GetAllEstablishmentProductsUseCase

  constructor (getAllEstablishmentProducts: GetAllEstablishmentProductsUseCase) {
    this.getAllEstablishmentProducts = getAllEstablishmentProducts
  }

  async handle (
    httpRequest: HttpRequest<
    GetAllEstablishmentProductsController.DTO,
    GetAllEstablishmentProductsController.Params
    >
  ): Promise<HttpResponse<GetAllEstablishmentProductsController.DTO>> {
    try {
      const establishmentId = httpRequest.params.id

      const resultGetAll =
        await this.getAllEstablishmentProducts.getAllEstablishmentProducts(
          establishmentId
        )
      if (resultGetAll.isLeft()) {
        return badRequest(resultGetAll.value)
      }

      const { value: productsEntity } = resultGetAll
      const products: GetAllEstablishmentProductsController.Response =
        productsEntity.map((product: Omit<ProductEntity, 'establishment'>) => ({
          id: product.id,
          description: product.description,
          isAvailable: product.isAvailable,
          name: product.name,
          price: product.price,
          image: product.image,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      return ok(products)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return serverError()
    }
  }
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentProductsController {
  export type DTO = {
    authenticated: {
      id: string
    }
  }

  export type Params = {
    id: string
  }

  export type Response = Array<Omit<ProductEntity, 'establishment' | 'deletedAt'>>
}
