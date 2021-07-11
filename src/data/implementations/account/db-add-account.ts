import {
  AddAccountRepository,
  GetEstablishedByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { AccountModel } from '@/domain/models';
import { CreateAccountUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBCreateAccount implements CreateAccountUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly establishedRepo: GetEstablishedByIdRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async create({
    establishmentId,
    idUser
  }: CreateAccountUseCase.Params): Promise<Either<AppError, AccountModel>> {
    const trackedEstablishment = await this.establishedRepo.getById(
      establishmentId
    );

    if (!trackedEstablishment)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const newAccount: Omit<AccountModel, 'client'> = {
      id: this.idGenerator.generate(),
      establishment: trackedEstablishment,
      requestsMusic: [],
      requestsProduct: []
    };

    const result = await this.addAccountRepository.add(newAccount, idUser);

    delete result.client;
    delete result.establishment.manager;
    return right(result as any);
  }
}
