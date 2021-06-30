import { GetProductByIdRepository } from '@/data/protocols/db/product';
import { ProductModel } from '@/domain/models';
import { GetProductByIdUseCase } from '@/domain/usecases/product';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBGetProductByID implements GetProductByIdUseCase {
  constructor(private readonly repository: GetProductByIdRepository) {}
  async getById(
    idUser: string,
    idProduct: string
  ): Promise<Either<AppError, ProductModel>> {
    const product = await this.repository.getProductById(idProduct);
    const userIdProduct = product.establishment.manager.id;

    if (idUser !== userIdProduct)
      return left(new AppError('Produto Não Encontrado'));

    delete product.deleteAt;

    return right(product as ProductModel);
  }
}
