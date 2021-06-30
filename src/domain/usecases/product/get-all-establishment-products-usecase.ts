import { ProductModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetAllEstablishmentProductsUseCase {
  getAllEstablishmentProducts(
    idUser,
    idEstablishment
  ): Promise<Either<AppError, Omit<ProductModel, 'establishment'>[]>>;
}
