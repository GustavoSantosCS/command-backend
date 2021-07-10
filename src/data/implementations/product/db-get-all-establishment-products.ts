import {
  GetEstablishedByIdRepository,
  GetAllEstablishmentProductsRepository
} from '@/data/protocols';
import { ProductModel } from '@/domain/models';
import { GetAllEstablishmentProductsUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBGetAllEstablishmentProducts
  implements GetAllEstablishmentProductsUseCase
{
  constructor(
    private readonly establishedRepository: GetEstablishedByIdRepository,
    private readonly repository: GetAllEstablishmentProductsRepository
  ) {}

  async getAllEstablishmentProducts(
    idUser: string,
    idEstablishment: string
  ): Promise<Either<AppError, Omit<ProductModel, 'establishment'>[]>> {
    const establishment = await this.establishedRepository.getById(
      idEstablishment
    );

    if (!establishment)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    let products = await this.repository.getAllEstablishmentProducts(
      idEstablishment
    );

    products = products.map(product => {
      // eslint-disable-next-line no-param-reassign
      delete product.establishment;
      // eslint-disable-next-line no-param-reassign
      delete product.deletedAt;
      return product;
    });

    return right(products);
  }
}
