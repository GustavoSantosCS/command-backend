import {
  GetAccountByIdRepository,
  GetAllAccountRequestProductRepository
} from '@/data/protocols'
import { AccountNotFoundError } from '@/domain/errors'
import { GetAllAccountRequestProductUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DbGetAllAccountRequestProduct
implements GetAllAccountRequestProductUseCase {
  private readonly getAllRepo: GetAllAccountRequestProductRepository
  private readonly getAccountRepo: GetAccountByIdRepository

  constructor (
    getAllRepo: GetAllAccountRequestProductRepository,
    getByIdRepo: GetAccountByIdRepository
  ) {
    this.getAccountRepo = getByIdRepo
    this.getAllRepo = getAllRepo
  }

  async getAllAccountRequestsProduct ({
    accountId,
    userId
  }): Promise<GetAllAccountRequestProductUseCase.Result> {
    const account = await this.getAccountRepo.getById(accountId, {
      withClient: true
    })
    if (!account || account?.client.id !== userId) { return left(new AccountNotFoundError()) }

    const requestsProduct = await this.getAllRepo.getAllAccountRequestsProduct(
      accountId
    )

    const result: GetAllAccountRequestProductUseCase.Return =
      requestsProduct.map(request => ({
        id: request.id,
        obs: request.obs,
        amountOfProduct: request.amountOfProduct,
        product: request.product,
        total: request.total,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      }))

    return right(result)
  }
}
