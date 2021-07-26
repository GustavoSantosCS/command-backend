import {
  GetEstablishmentByIdRepository,
  GetAllEstablishmentProductsRepository
} from '@/data/protocols';
import { GetAllEstablishmentProductsUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';

export class DBGetAllEstablishmentProducts
  implements GetAllEstablishmentProductsUseCase
{
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly getAllEstablishmentProductsRepo: GetAllEstablishmentProductsRepository;

  constructor(
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    getAllEstablishmentProductsRepo: GetAllEstablishmentProductsRepository
  ) {
    this.getAllEstablishmentProductsRepo = getAllEstablishmentProductsRepo;
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
  }

  async getAllEstablishmentProducts(
    establishmentId: string
  ): Promise<GetAllEstablishmentProductsUseCase.Result> {
    const establishment = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );
    if (!establishment) return left(new EstablishmentNotFoundError());

    const products =
      await this.getAllEstablishmentProductsRepo.getAllEstablishmentProducts(
        establishmentId
      );

    return right(products);
  }
}
