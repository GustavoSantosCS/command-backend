import {
  GetEstablishmentByIdRepository,
  IDGenerator,
  AddProductRepository
} from '@/data/protocols';
import { AddProductUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';

export class DBAddProduct implements AddProductUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly addProductRepo: AddProductRepository;

  constructor(
    idGenerator: IDGenerator,
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    addProductRepo: AddProductRepository
  ) {
    this.idGenerator = idGenerator;
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
    this.addProductRepo = addProductRepo;
  }

  async add({
    establishmentId,
    userId,
    name,
    description,
    price,
    productImage
  }: AddProductUseCase.Params): AddProductUseCase.Result {
    const establishment = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );

    if (establishment?.manager.id !== userId)
      return left(new EstablishmentNotFoundError());

    const product = await this.addProductRepo.save(
      {
        id: this.idGenerator.generate(),
        name,
        description,
        isAvailable: true,
        price,
        image: productImage,
        establishment: null
      },
      establishmentId
    );

    return right(product);
  }
}
