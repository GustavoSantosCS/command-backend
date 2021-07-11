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

  async getAllAccountRequestProduct(
    idAccount: any
  ): Promise<RequestProductEntity[]> {
    const requestProductRepo = await TypeORMHelpers.getRepository(
      RequestProductEntity
    );

    const userRequestProduct = await requestProductRepo
      .createQueryBuilder('requests_product')
      .innerJoin('requests_product.account', 'accounts')
      .innerJoinAndSelect('requests_product.product', 'products')
      .innerJoinAndSelect('products.image', 'product_image')
      .where('accounts.id = :id', { id: idAccount })
      .getMany();

    return userRequestProduct;
  }

  async getAllEstablishmentRequestProduct(
    idEstablishment: any
  ): Promise<RequestProductEntity[]> {
    const requestProductRepo = await TypeORMHelpers.getRepository(
      RequestProductEntity
    );

    const userRequestProduct = await requestProductRepo
      .createQueryBuilder('requests_product')
      .innerJoinAndSelect('requests_product.product', 'products')
      .innerJoinAndSelect('requests_product.account', 'accounts')
      .innerJoin('products.establishment', 'establishments')
      .where('establishments.id = :id', { id: idEstablishment })
      .orderBy('requests_product.created_at')
      .getMany();

    return userRequestProduct;
  }
}
