import { RequestProductEntity } from '@/data/entities';
import {
  CreateRequestProductRepository,
  GetEstablishedByIdRepository,
  GetProductByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { CreateRequestProductUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, right } from '@/shared/either';

export class DBCreateRequestProduct implements CreateRequestProductUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly establishedRepository: GetEstablishedByIdRepository,
    private readonly productRepository: GetProductByIdRepository,
    private readonly requestProductRepository: CreateRequestProductRepository
  ) {}
  async createRequestProduct({
    amountOfProduct,
    idProduct,
    idAccount,
    obs,
    total
  }: CreateRequestProductUseCase.Params): Promise<
    Either<AppError, RequestProductEntity>
  > {
    const newRequestProduct = await this.requestProductRepository.save(
      {
        id: this.idGenerator.generate(),
        amountOfProduct,
        obs,
        total
      },
      idProduct,
      idAccount
    );

    return right(newRequestProduct);
  }
}
