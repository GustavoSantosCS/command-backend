import { GetProductByIdRepository } from '@/data/protocols'
import { GetProductByIdUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'
import { ProductNotFoundError } from '@/domain/errors'

export class DBGetProductByID implements GetProductByIdUseCase {
  private readonly getProductByIdRepo: GetProductByIdRepository

  constructor (getProductByIdRepo: GetProductByIdRepository) {
    this.getProductByIdRepo = getProductByIdRepo
  }

  async getById (idProduct: string): Promise<GetProductByIdUseCase.Result> {
    const product = await this.getProductByIdRepo.getById(idProduct)

    if (!product) return left(new ProductNotFoundError())

    const result: GetProductByIdUseCase.Return = {
      id: product.id,
      name: product.name,
      price: product.price,
      isAvailable: product.isAvailable,
      description: product.description,
      image: product.image,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt
    }

    return right(result)
  }
}
