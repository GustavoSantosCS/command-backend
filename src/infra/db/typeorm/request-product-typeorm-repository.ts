import {
  AccountEntity,
  ProductEntity,
  RequestProductEntity
} from '@/data/entities';
import {
  CreateRequestProductRepository,
  GetAllAccountRequestProductRepository
} from '@/data/protocols';
import { RequestProductModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class RequestProductTypeOrmRepository
  implements
    CreateRequestProductRepository,
    GetAllAccountRequestProductRepository
{
  async save(
    newRequestProduct: RequestProductModel,
    idProduct: string,
    accountId: string
  ): Promise<RequestProductEntity> {
    const connection = await TypeORMHelpers.getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(
        ProductEntity,
        idProduct,
        { relations: ['image'] }
      );
      const account = await queryRunner.manager.findOne(
        AccountEntity,
        accountId
      );
      let requestProduct = new RequestProductEntity(newRequestProduct);
      requestProduct.account = account;
      requestProduct.product = product;
      requestProduct = await queryRunner.manager.save(requestProduct);
      await queryRunner.commitTransaction();
      delete requestProduct.account;
      return requestProduct;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('RequestProductTypeOrmRepository:65 => ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllAccountRequestsProduct(
    accountId: any
  ): Promise<Omit<RequestProductEntity, 'account'>[]> {
    const requestProductRepo = await TypeORMHelpers.getRepository(
      RequestProductEntity
    );
    await new Promise(resolve => setTimeout(resolve, 15000));
    const userRequestProduct = await requestProductRepo
      .createQueryBuilder('requests_product')
      .innerJoin('requests_product.account', 'accounts')
      .innerJoinAndSelect('requests_product.product', 'products')
      .innerJoinAndSelect('products.image', 'product_image')
      .where('accounts.id = :accountId', { accountId })
      .orderBy('requests_product.created_at', 'ASC')
      .getMany();

    return userRequestProduct;
  }
}
