import {
  EstablishmentEntity,
  ProductEntity,
  ProductImageEntity
} from '@/data/entities';
import {
  AddProductRepository,
  GetAllEstablishmentProductsRepository,
  GetProductByIdRepository
} from '@/data/protocols/db/product';
import { ProductModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class ProductTypeOrmRepository
  implements
    AddProductRepository,
    GetProductByIdRepository,
    GetAllEstablishmentProductsRepository
{
  async save(
    product: ProductModel,
    establishmentId: string
  ): Promise<ProductEntity> {
    const connection = await TypeORMHelpers.getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save image
      let imageEntity = new ProductImageEntity(product.image);
      imageEntity = await queryRunner.manager.save(imageEntity);

      // get establishment
      const trackEstablishment = await queryRunner.manager.findOne(
        EstablishmentEntity,
        establishmentId,
        {
          relations: ['products']
        }
      );

      // Save product
      let productEntity = new ProductEntity(product);
      productEntity.establishment = trackEstablishment;
      productEntity.image = imageEntity;
      productEntity = await queryRunner.manager.save(productEntity);

      // Save establishment with the new product
      if (!trackEstablishment.products) {
        trackEstablishment.products = [];
      }

      trackEstablishment.products.push(productEntity);
      await queryRunner.manager.save(trackEstablishment);

      await queryRunner.commitTransaction();

      delete productEntity.establishment;

      return productEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }

  async getProductById(id: string): Promise<ProductEntity> {
    const productRepo = await TypeORMHelpers.getRepository(ProductEntity);

    const productEntity = await productRepo
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.establishment', 'establishments')
      .innerJoinAndSelect('establishments.manager', 'users')
      .where('products.id = :id', { id })
      .getOne();

    return productEntity;
  }

  async getAllEstablishmentProducts(
    idEstablishment: string
  ): Promise<ProductEntity[]> {
    const productRepo = await TypeORMHelpers.getRepository(ProductEntity);

    const productsEntity = await productRepo
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.image', 'product_image')
      .innerJoinAndSelect('products.establishment', 'establishments')
      .where('establishments.id = :id', { id: idEstablishment })
      .getMany();

    return productsEntity;
  }
}
