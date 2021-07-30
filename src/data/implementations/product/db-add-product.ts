import {
  GetEstablishmentByIdRepository,
  IDGenerator,
  AddProductRepository
} from '@/data/protocols';
import { AddProductUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';
import { ProductEntity, ProductImageEntity } from '@/data/entities';

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
    const establishmentRepo = await this.getEstablishmentByIdRepo.getById(
      establishmentId,
      { withManager: true }
    );

    if (establishmentRepo?.manager.id !== userId)
      return left(new EstablishmentNotFoundError());

    const newProduct = new ProductEntity();
    newProduct.id = this.idGenerator.generate();
    newProduct.name = name;
    newProduct.description = description;
    newProduct.price = price;
    newProduct.establishment = establishmentRepo;
    newProduct.isAvailable = true;
    const image = new ProductImageEntity();
    Object.assign(image, productImage);
    newProduct.image = image;

    const product = await this.addProductRepo.save(newProduct);

    return right(product);
  }
}
