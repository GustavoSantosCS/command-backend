import {
  AccountEntity,
  ProductEntity,
  RequestProductEntity
} from '@/data/entities';
import { CreateRequestProductRepository } from '@/data/protocols';
import { RequestProductModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class RequestProductTypeOrmRepository
  implements CreateRequestProductRepository
{
  async save(
    newRequestProduct: RequestProductModel,
    idProduct: string,
    idAccount: string
  ): Promise<RequestProductEntity> {
    const connection = await TypeORMHelpers.getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(
        ProductEntity,
        idProduct
      );
      const account = await queryRunner.manager.findOne(
        AccountEntity,
        idAccount
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
    } finally {
      await queryRunner.release();
    }
    return null;
  }
}
