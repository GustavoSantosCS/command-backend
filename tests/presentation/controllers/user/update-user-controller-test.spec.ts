import { HttpRequest } from '@/presentation/protocols'
import { ValidatorSpy } from '@tests/validation/mock'
import { UpdateUserUseCaseSpy } from '@tests/domain/mock/usecases'
import { UpdateUserController } from '@/presentation/controllers/user'
import { badRequest, serverError } from '@/utils/http'
import { left, right } from '@/shared/either'
import { makeMockUser } from '@tests/domain/mock/models'
import { UserEntity } from '@/data/entities'
import { EmailAlreadyUseError } from '@/domain/errors'

let httpRequest: HttpRequest<UpdateUserController.DTO>
let authenticated: { id: string }
let newUserData: Omit<UpdateUserController.DTO, 'authenticated'>

let sut: UpdateUserController
let validate: ValidatorSpy
let usecaseUpdate: UpdateUserUseCaseSpy
let userUpdate: UserEntity

describe('Test Unit: UpdateUserController', () => {
  beforeEach(() => {
    userUpdate = makeMockUser({ id: true })
    authenticated = { id: userUpdate.id }
    newUserData = {
      name: userUpdate.name,
      email: userUpdate.email,
      password: userUpdate.password
    }

    httpRequest = {
      body: {
        authenticated,
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password
      }
    }

    validate = new ValidatorSpy()
    usecaseUpdate = new UpdateUserUseCaseSpy()
    usecaseUpdate.return = right(userUpdate)
    sut = new UpdateUserController(validate, usecaseUpdate)
  })

  it('should call validate with the correct values', async () => {
    const spy = validate

    await sut.handle(httpRequest)

    expect(spy.calls).toBe(1)
    expect(spy.parameters).toEqual({
      name: newUserData.name,
      email: newUserData.email.toLocaleLowerCase(),
      password: newUserData.password
    })
  })

  it('should return 400 if validate fall', async () => {
    const spy = validate
    spy.return = spy.returns.left

    const result = await sut.handle(httpRequest)

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should call UpdateUserUseCase with the correct values', async () => {
    const spy = usecaseUpdate

    await sut.handle(httpRequest)

    expect(spy.calls).toBe(1)
    expect(spy.parameters).toEqual({
      id: authenticated.id,
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password
    })
  })

  it('should return 500 if UpdateUserUseCase throws', async () => {
    const spy = usecaseUpdate
    spy.throwError()

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response).toEqual(serverError())
  })

  it('should return 400 if UpdateUserUseCase return unsuccess', async () => {
    const spy = usecaseUpdate
    spy.return = left(new EmailAlreadyUseError(''))

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response).toEqual(badRequest(new EmailAlreadyUseError('')))
  })

  it('should return 200 if UpdateUserUseCase return success', async () => {
    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeTruthy()
  })
})
