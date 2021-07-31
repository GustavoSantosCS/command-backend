import faker from 'faker'
import { AddUserUseCase } from '@/domain/usecases'
import { AddUserController } from '@/presentation/controllers/user'
import { Validator } from '@/validation/protocols'
import { HttpRequest } from '@/presentation/protocols'
import { UserEntity } from '@/data/entities'
import { badRequest, serverError } from '@/utils/http'
import { EmailAlreadyUseError } from '@/domain/errors'
import { AddUserUseCaseSpy } from '@tests/domain/mock/usecases'
import { ValidatorSpy } from '@tests/validation/mock'
import { makeMockAddUser } from '@tests/domain/mock/models'

faker.locale = 'pt_BR'

export const makeMockHttpRequest = (): HttpRequest<AddUserController.DTO> => ({
  body: { ...addUser }
})

let addUser: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> & {
  confirmPassword: string
}
let sut: AddUserController
let httpRequestMock: HttpRequest<AddUserController.DTO>
let validatorSpy: Validator
let addUserUseCaseSpy: AddUserUseCase

describe('Test Unit: AddUserController', () => {
  beforeEach(() => {
    addUser = makeMockAddUser()
    httpRequestMock = makeMockHttpRequest()
    validatorSpy = new ValidatorSpy()
    addUserUseCaseSpy = new AddUserUseCaseSpy()
    sut = new AddUserController(validatorSpy, addUserUseCaseSpy)
  })

  it('should call the validator with the correct values', async () => {
    const spy = validatorSpy as ValidatorSpy
    await sut.handle(httpRequestMock)

    expect(spy.parameters).toEqual(httpRequestMock.body)
  })

  it('should return 400 if validator returns error', async () => {
    const spy = validatorSpy as ValidatorSpy
    spy.return = spy.returns.left

    const response = await sut.handle(httpRequestMock)

    expect(response.statusCode).toBe(400)
    expect(response).toEqual(badRequest(spy.returns.left.value as any))
  })

  it('should call AddUserUseCase with the correct values', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy

    await sut.handle(httpRequestMock)

    expect(spy.parameters).toEqual({
      name: addUser.name,
      email: addUser.email,
      password: addUser.password
    })
  })

  it('should return 400 if AddUserUseCase returns error', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy
    spy.return = spy.returns.left

    const response = await sut.handle(httpRequestMock)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response).toEqual(
      badRequest(new EmailAlreadyUseError(httpRequestMock.body.email))
    )
  })

  it('should returns 500 if AddUserUsecase throws', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy
    spy.throwError()

    const response = await sut.handle(httpRequestMock)

    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('errors')
    expect(response).toEqual(serverError())
  })

  it('should return 200 if AddUserUseCase is success', async () => {
    const response = await sut.handle(httpRequestMock)

    expect(response.statusCode).toBe(200)
    expect(response.body).not.toBeUndefined()
  })
})
