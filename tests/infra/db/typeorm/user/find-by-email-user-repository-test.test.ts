import { UserEntity } from '@/data/entities'
import {
  AddUserRepository,
  SearchUserByEmailRepository
} from '@/data/protocols'
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm'
import { makeMockUser } from '@tests/domain/mock/models'

let addRepository: AddUserRepository
let sut: SearchUserByEmailRepository
let userEntity: UserEntity

describe('Test Integration', () => {
  beforeAll(async () => {
    await TypeORMHelpers.connect()
  })

  afterAll(async () => {
    await TypeORMHelpers.clearDataBase()
    await TypeORMHelpers.disconnect()
  })

  beforeEach(async () => {
    userEntity = makeMockUser({ id: true })
    delete userEntity.avatar

    sut = new UserTypeOrmRepository()
    addRepository = sut as UserTypeOrmRepository

    await TypeORMHelpers.clearDataBase()
  })

  it('should return an entity', async () => {
    await addRepository.save(userEntity)

    const foundEntity = await sut.searchByEmail(userEntity.email)

    expect(foundEntity).toBeTruthy()
    expect(foundEntity).toEqual(foundEntity)
  })

  it('should not return an entity is the database is empty', async () => {
    const foundEntity = await sut.searchByEmail('entityToSave.email')

    expect(foundEntity).toBeUndefined()
  })

  it('should not return an entity is the database not found the email', async () => {
    await addRepository.save(userEntity)

    const foundEntity = await sut.searchByEmail('entityToSave.email')

    expect(foundEntity).toBeUndefined()
  })
})
