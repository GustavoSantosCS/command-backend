import {
  AddAccountRepository,
  GetEstablishmentByIdRepository,
  GetUserByIdRepository,
  IDGenerator
} from '@/data/protocols'
import { CreateAccountUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { AccountEntity } from '@/data/entities'

export class DBCreateAccount implements CreateAccountUseCase {
  private readonly idGenerator: IDGenerator
  private readonly getEstablishmentRepo: GetEstablishmentByIdRepository
  private readonly getUserRepo: GetUserByIdRepository
  private readonly addAccountRepo: AddAccountRepository

  constructor (
    idGenerator: IDGenerator,
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    getUserRepo: GetUserByIdRepository,
    addAccountRepo: AddAccountRepository
  ) {
    this.idGenerator = idGenerator
    this.getEstablishmentRepo = getEstablishmentByIdRepo
    this.getUserRepo = getUserRepo
    this.addAccountRepo = addAccountRepo
  }

  async add ({
    establishmentId,
    userId
  }: CreateAccountUseCase.Params): Promise<CreateAccountUseCase.Result> {
    const establishmentRepo = await this.getEstablishmentRepo.getById(
      establishmentId
    )
    if (!establishmentRepo) return left(new EstablishmentNotFoundError())

    const userRepo = await this.getUserRepo.getById(userId)

    const newAccount = new AccountEntity()
    newAccount.id = this.idGenerator.generate()
    newAccount.client = userRepo
    newAccount.establishment = establishmentRepo
    newAccount.requestsProduct = []

    const accountRepo = await this.addAccountRepo.save(newAccount)
    return right(accountRepo)
  }
}
