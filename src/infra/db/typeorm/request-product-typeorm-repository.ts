import { RequestProductEntity } from '@/data/entities'
import {
  CreateRequestProductRepository,
  GetAllAccountRequestProductRepository
} from '@/data/protocols'
import { TypeORMHelpers } from './typeorm-helper'

export class RequestProductTypeOrmRepository
  implements
    CreateRequestProductRepository,
    GetAllAccountRequestProductRepository
{
  async save(
    newRequestProduct: CreateRequestProductRepository.Param
  ): Promise<CreateRequestProductRepository.Return> {
    const queryRunner = await TypeORMHelpers.createQueryRunner()
    await queryRunner.startTransaction()
    try {
      const requestProduct = await queryRunner.manager.save(newRequestProduct)
      await queryRunner.commitTransaction()
      return requestProduct
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async getAllAccountRequestsProduct(
    accountId: string
  ): Promise<Array<Omit<RequestProductEntity, 'account'>>> {
    const requestProductRepo = await TypeORMHelpers.getRepository(
      RequestProductEntity
    )
    const userRequestProduct = await requestProductRepo
      .createQueryBuilder('requests_product')
      .innerJoin('requests_product.account', 'accounts')
      .innerJoinAndSelect('requests_product.product', 'products')
      .innerJoinAndSelect('products.image', 'product_image')
      .where('accounts.id = :accountId', { accountId })
      .orderBy('requests_product.created_at', 'ASC')
      .getMany()

    return userRequestProduct
  }
}
