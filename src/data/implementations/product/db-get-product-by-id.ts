import { GetProductByIdRepository } from '@/data/protocols';
import { ProductModel } from '@/domain/models';
import { GetProductByIdUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBGetProductByID implements GetProductByIdUseCase {
  constructor(private readonly repository: GetProductByIdRepository) {}
  async getById(idProduct: string): Promise<Either<AppError, ProductModel>> {
    const product = await this.repository.getById(idProduct);

    if (!product) return left(new AppError('Produto Não Encontrado'));

    delete product.deletedAt;

    return right(product as ProductModel);
  }
}
