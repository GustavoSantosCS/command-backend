import { ProductEntity } from '@/data/entities'
import {
  AddProductRepository,
  GetAllEstablishmentProductsRepository,
  GetProductByIdRepository
} from '@/data/protocols'
import { TypeORMHelpers } from './typeorm-helper'

export class ProductTypeOrmRepository
  implements
    AddProductRepository,
    GetProductByIdRepository,
    GetAllEstablishmentProductsRepository
{
  async save(product: ProductEntity): Promise<ProductEntity> {
    const connection = await TypeORMHelpers.getConnection()
    const queryRunner = connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Save image
      const image = await queryRunner.manager.save(product.image)

      // Save product
      product.image = image
      const productRepo = await queryRunner.manager.save(product)

      await queryRunner.commitTransaction()
      return productRepo
    } catch (err) {
      console.error(err)
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async getById(
    id: string,
    config?: GetProductByIdRepository.Config
  ): Promise<ProductEntity> {
    const productRepo = await TypeORMHelpers.getRepository(ProductEntity)

    let queryRunner = productRepo
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.image', 'product_image')

    if (config?.whitEstablishment) {
      queryRunner = queryRunner.innerJoinAndSelect(
        'products.establishment',
        'establishments'
      )
    }

    const productEntity = queryRunner
      .where('products.id = :id', { id })
      .getOne()

    return productEntity
  }

  async getAllEstablishmentProducts(
    establishmentId: string
  ): Promise<ProductEntity[]> {
    const productRepo = await TypeORMHelpers.getRepository(ProductEntity)

    const productsEntity = await productRepo
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.image', 'product_image')
      .innerJoin('products.establishment', 'establishments')
      .where('establishments.id = :establishmentId', { establishmentId })
      .orderBy('products.name', 'ASC')
      .getMany()

    return productsEntity
  }
}
