import faker from 'faker'
import { UserEntity } from '@/data/entities'
import { UpdateUserUseCase } from '@/domain/usecases'
import { HasherSpy, HashComparerSpy } from '@tests/infra/mock/cryptography'
import {
  GetUserByIdRepositorySpy,
  SearchUserByEmailRepositorySpy,
  UpdateUserRepositorySpy
} from '@tests/infra/mock/db/user'
import { EmailAlreadyUseError } from '@/domain/errors'
import { DBUpdateUser } from '@/data/implementations'
import { makeMockUser } from '@tests/domain/mock/models'

let sut: UpdateUserUseCase
let searchByEmailRepositorySpy: SearchUserByEmailRepositorySpy
let updateUserRepositorySpy: UpdateUserRepositorySpy
let getUserByIdRepository: GetUserByIdRepositorySpy
let hasherSpy: HasherSpy
let hashComparerSpy: HashComparerSpy

let newUserEntity: UserEntity
let newUserEntityHashPassword: UserEntity
let userEntity: UserEntity
let userEntityHashPassword: UserEntity
let userEntityDifferentEmail: UserEntity
let hashPassword: string

describe('Test Unit: DBUpdateUser', () => {
  beforeEach(() => {
    newUserEntity = makeMockUser({ id: true, avatar: false })

    hashPassword = `${faker.datatype.uuid()}-${newUserEntity.password}`
    newUserEntityHashPassword = { ...newUserEntity, password: hashPassword }

    userEntity = {
      ...newUserEntity
    }
    userEntityHashPassword = { ...userEntity, password: hashPassword }

    userEntityDifferentEmail = {
      ...userEntityHashPassword,
      email: faker.datatype.uuid() + userEntityHashPassword.email
    }

    searchByEmailRepositorySpy = new SearchUserByEmailRepositorySpy()
    searchByEmailRepositorySpy.return = null

    hasherSpy = new HasherSpy()
    hasherSpy.return = hashPassword
    hashComparerSpy = new HashComparerSpy()

    updateUserRepositorySpy = new UpdateUserRepositorySpy()
    updateUserRepositorySpy.return = userEntityHashPassword

    getUserByIdRepository = new GetUserByIdRepositorySpy()
    getUserByIdRepository.return = userEntity

    sut = new DBUpdateUser(
      getUserByIdRepository,
      hasherSpy,
      hashComparerSpy,
      searchByEmailRepositorySpy,
      updateUserRepositorySpy
    )
  })

  it('should call GetUserByIdRepository with the correct values', async () => {
    const spy = getUserByIdRepository

    await sut.update(newUserEntity)

    expect(spy.calls).toBe(1)
    expect(spy.parameters).toBe(newUserEntity.id)
  })

  it('should call SearchByEmailRepository if the TrackUser have different email', async () => {
    getUserByIdRepository.return = userEntityDifferentEmail
    const spy = searchByEmailRepositorySpy

    await sut.update(newUserEntity)

    expect(spy.calls).toBe(1)
    expect(spy.parameters).toBe(newUserEntity.email)
  })

  it('should return EmailAlreadyUseError if the email is already in use and is not the user current', async () => {
    getUserByIdRepository.return = userEntityDifferentEmail
    searchByEmailRepositorySpy.return = userEntityHashPassword

    const result = await sut.update(newUserEntity)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new EmailAlreadyUseError(newUserEntity.email))
  })

  it('should call Hasher with the correct', async () => {
    const spy = hasherSpy

    await sut.update(newUserEntity)

    expect(spy.calls).toBe(1)
    expect(spy.parameters).toBe(newUserEntity.password)
  })

  it('should call UpdateUserRepository with the correct', async () => {
    const spy = updateUserRepositorySpy

    await sut.update(newUserEntity)

    expect(spy.calls).toBe(1)
    expect(spy.parameters.id).toEqual(newUserEntityHashPassword.id)
    expect(spy.parameters.password).toEqual(newUserEntityHashPassword.password)
  })

  it('should throws if GetUserByIdRepository throws', async () => {
    const spy = getUserByIdRepository
    spy.throwsError()

    const promise = sut.update(newUserEntity)

    await expect(promise).rejects.toThrow()
  })

  it('should throws if SearchByEmailRepository throws', async () => {
    getUserByIdRepository.return = userEntityDifferentEmail
    searchByEmailRepositorySpy.throwsError()

    const promise = sut.update(newUserEntity)

    await expect(promise).rejects.toThrow()
  })

  it('should throws if UpdateUserRepository throws', async () => {
    const spy = updateUserRepositorySpy
    spy.throwsError()

    const promise = sut.update(newUserEntity)

    await expect(promise).rejects.toThrow()
  })

  it('should return UserEntity if success', async () => {
    const result = await sut.update(newUserEntity)

    expect(result.isRight()).toBeTruthy()
    expect((result.value as UserEntity).id).toEqual(userEntityHashPassword.id)
  })
})
