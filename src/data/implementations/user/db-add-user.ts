import { UserEntity } from '@/data/entities'
import {
  UniqueIdGenerator,
  AddUserRepository,
  SearchUserByEmailRepository,
  Hasher
} from '@/data/protocols'
import { EmailAlreadyUseError } from '@/domain/errors'
import { AddUserUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBAddUser implements AddUserUseCase {
  private readonly idGenerator: UniqueIdGenerator
  private readonly hasher: Hasher
  private readonly searchByEmailRepo: SearchUserByEmailRepository
  private readonly addUserRepo: AddUserRepository

  constructor(
    idGenerator: UniqueIdGenerator,
    hasher: Hasher,
    searchByEmailRepository: SearchUserByEmailRepository,
    addUserRepository: AddUserRepository
  ) {
    this.idGenerator = idGenerator
    this.hasher = hasher
    this.searchByEmailRepo = searchByEmailRepository
    this.addUserRepo = addUserRepository
  }

  async save({
    name,
    email,
    password
  }: AddUserUseCase.Params): Promise<AddUserUseCase.Response> {
    const searchResult = await this.searchByEmailRepo.searchByEmail(email)

    if (searchResult) {
      return left(new EmailAlreadyUseError(email))
    }

    const hasherPassword = await this.hasher.hash(password)
    const newUser = new UserEntity()
    newUser.id = this.idGenerator.generate()
    newUser.name = name
    newUser.email = email
    newUser.password = hasherPassword

    const userRepo = await this.addUserRepo.save(newUser)

    const userResult: AddUserUseCase.Result = {
      id: userRepo.id,
      name: userRepo.name,
      email: userRepo.email,
      createdAt: userRepo.createdAt,
      updatedAt: userRepo.updatedAt
    }

    return right(userResult)
  }
}
