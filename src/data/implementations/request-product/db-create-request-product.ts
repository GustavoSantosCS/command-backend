import {
  CreateRequestProductRepository,
  GetAccountByIdRepository,
  GetProductByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { CreateRequestProductUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { AccountNotFoundError, ProductNotFoundError } from '@/domain/errors';
import { RequestProductEntity } from '@/data/entities';

export class DBCreateRequestProduct implements CreateRequestProductUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly accountRepo: GetAccountByIdRepository;
  private readonly productRepo: GetProductByIdRepository;
  private readonly requestProductRepo: CreateRequestProductRepository;

  constructor(
    idGenerator: IDGenerator,
    accountRepository: GetAccountByIdRepository,
    productRepository: GetProductByIdRepository,
    requestProductRepository: CreateRequestProductRepository
  ) {
    this.idGenerator = idGenerator;
    this.accountRepo = accountRepository;
    this.productRepo = productRepository;
    this.requestProductRepo = requestProductRepository;
  }

  async createRequestProduct({
    userId,
    productId,
    accountId,
    amountOfProduct,
    obs,
    total
  }: CreateRequestProductUseCase.Params): Promise<CreateRequestProductUseCase.Result> {
    const accountRepo = await this.accountRepo.getById(accountId, {
      withClient: true,
      withEstablishment: true
    });

    // the account exists and belongs to a client
    if (!accountRepo || accountRepo?.client.id !== userId)
      return left(new AccountNotFoundError());

    // the product exists
    const productRepo = await this.productRepo.getById(productId, {
      whitEstablishment: true
    });
    if (!productRepo) return left(new ProductNotFoundError());

    // the product belongs to the establishment of the account
    if (accountRepo.establishment.id !== productRepo.establishment.id)
      return left(new ProductNotFoundError());

    const newRequestProduct = new RequestProductEntity();
    newRequestProduct.id = this.idGenerator.generate();
    newRequestProduct.amountOfProduct = amountOfProduct;
    newRequestProduct.product = productRepo;
    newRequestProduct.account = accountRepo;
    newRequestProduct.obs = obs;
    newRequestProduct.total = total;

    const requestProductRepo = await this.requestProductRepo.save(
      newRequestProduct
    );

    return right(requestProductRepo);
  }
}
