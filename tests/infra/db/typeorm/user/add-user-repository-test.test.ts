import { UserEntity } from '@/data/entities'
import { AddUserRepository } from '@/data/protocols'
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm'
import { makeMockUser } from '@tests/domain/mock/models'

let sut: AddUserRepository
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

    await TypeORMHelpers.clearDataBase()
    sut = new UserTypeOrmRepository()
  })

  it('should return an entity is add successfully', async () => {
    const result = await sut.save(userEntity)

    expect(result.id).toBe(userEntity.id)
    expect(result.name).toBe(userEntity.name)
    expect(result.email).toBe(userEntity.email)
    expect(result.password).toBe(userEntity.password)
  })
})
