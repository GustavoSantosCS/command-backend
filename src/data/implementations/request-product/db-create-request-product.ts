import {
  CreateRequestProductRepository,
  GetAccountByIdRepository,
  GetProductByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { CreateRequestProductUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { AccountNotFoundError, ProductNotFoundError } from '@/domain/errors';

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
    amountOfProduct,
    productId,
    accountId,
    obs,
    total
  }: CreateRequestProductUseCase.Params): Promise<CreateRequestProductUseCase.Result> {
    const account = this.accountRepo.getById(accountId);
    if (!account) return left(new AccountNotFoundError());

    const product = this.productRepo.getById(productId);
    if (!product) return left(new ProductNotFoundError());

    const newRequestProduct = await this.requestProductRepo.save(
      {
        id: this.idGenerator.generate(),
        amountOfProduct,
        obs,
        total
      },
      productId,
      accountId
    );

    const result: CreateRequestProductUseCase.Return = {
      id: newRequestProduct.id,
      amountOfProduct: newRequestProduct.amountOfProduct,
      obs: newRequestProduct.obs,
      product: newRequestProduct.product,
      total: newRequestProduct.total,
      createdAt: newRequestProduct.createdAt,
      updatedAt: newRequestProduct.updatedAt
    };

    return right(result);
  }
}
