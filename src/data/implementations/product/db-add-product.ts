import { GetEstablishedByIdRepository, IDGenerator } from '@/data/protocols';
import { AddProductRepository } from '@/data/protocols/db/product';
import { ProductModel } from '@/domain/models';
import { AddProductUseCase } from '@/domain/usecases/product';
import { AppError } from '@/shared/app-error';
import { left, right } from '@/shared/either';

export class DBAddProduct implements AddProductUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly establishedRepository: GetEstablishedByIdRepository,
    private readonly productRepository: AddProductRepository
  ) {}
  async save({
    establishmentId,
    idUser,
    name,
    description,
    price,
    productImage
  }: AddProductUseCase.Params): AddProductUseCase.Response {
    const establishment = await this.establishedRepository.getById(
      establishmentId
    );

    if (establishment?.manager.id !== idUser)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const product = await this.productRepository.save(
      {
        id: this.idGenerator.generate(),
        name,
        description,
        isAvailable: true, // TODO: cadastra como true mas na alteração deve ser possível alterar tal valor
        price,
        image: productImage,
        establishment: null
      },
      establishmentId
    );

    delete product.deleteAt;

    return right(product as ProductModel);
  }
}
