import { GetAllAccountRequestProductRepository } from '@/data/protocols';
import { RequestProductModel } from '@/domain/models';
import { GetAllAccountRequestProductUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, right } from '@/shared/either';

export class DbGetAllAccountRequestProduct
  implements GetAllAccountRequestProductUseCase
{
  constructor(
    private readonly repository: GetAllAccountRequestProductRepository
  ) {}

  async getAllAccountRequestProduct(
    idAccount: string
  ): Promise<Either<AppError, RequestProductModel[]>> {
    return right(
      (await this.repository.getAllAccountRequestProduct(idAccount)) as any
    );
  }
}
