import { ProductModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetProductByIdUseCase {
  getById(idProduct: string): Promise<Either<AppError, ProductModel>>;
}
