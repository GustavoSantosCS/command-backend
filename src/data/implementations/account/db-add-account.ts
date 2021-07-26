import {
  AddAccountRepository,
  GetEstablishmentByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { AccountModel } from '@/domain/models';
import { CreateAccountUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';

export class DBCreateAccount implements CreateAccountUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly addAccountRepo: AddAccountRepository;

  constructor(
    idGenerator: IDGenerator,
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    addAccountRepo: AddAccountRepository
  ) {
    this.idGenerator = idGenerator;
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
    this.addAccountRepo = addAccountRepo;
  }

  async create({
    establishmentId,
    userId
  }: CreateAccountUseCase.Params): Promise<CreateAccountUseCase.Result> {
    const establishment = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );

    if (!establishment) return left(new EstablishmentNotFoundError());

    const accountModel: Omit<AccountModel, 'client'> = {
      id: this.idGenerator.generate(),
      establishment,
      requestsMusic: [],
      requestsProduct: []
    };

    const newAccount = await this.addAccountRepo.add(accountModel, userId);
    return right(newAccount);
  }
}
