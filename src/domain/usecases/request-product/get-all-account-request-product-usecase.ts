import { RequestProductModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetAllAccountRequestProductUseCase {
  getAllAccountRequestProduct(
    idAccount: string
  ): Promise<Either<AppError, RequestProductModel[]>>;
}
