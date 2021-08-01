import faker from 'faker'
import { UpdateUserAvatarController } from '@/presentation/controllers/user'
import { HttpRequest } from '@/presentation/protocols'
import { makeMockAvatarUser } from '@tests/domain/mock/models'
import { UserAvatarUseCaseSpy } from '@tests/domain/mock/usecases'
import { serverError } from '@/presentation/helpers/http'

let sut: UpdateUserAvatarController
let userAvatarUseCaseSpy: UserAvatarUseCaseSpy

const makerHttpRequest = (): HttpRequest<UpdateUserAvatarController.DTO> => ({
  body: {
    authenticated: {
      id: faker.datatype.uuid()
    },
    avatar: makeMockAvatarUser()
  }
})

describe('Test Unit: UpdateUserAvatarController', () => {
  beforeEach(() => {
    userAvatarUseCaseSpy = new UserAvatarUseCaseSpy()
    sut = new UpdateUserAvatarController(userAvatarUseCaseSpy)
  })

  it('should call UserAvatarUseCase with the correct values', async () => {
    const httpRequest = makerHttpRequest()
    const spy = userAvatarUseCaseSpy

    await sut.handle(httpRequest)

    expect(spy.parameters.userId).toEqual(httpRequest.body.authenticated.id)
    expect(spy.parameters.avatar).toEqual(httpRequest.body.avatar)
  })

  it('should return 500 if UserAvatarUseCase throws', async () => {
    const httpRequest = makerHttpRequest()
    const spy = userAvatarUseCaseSpy
    spy.throwError()

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response).toEqual(serverError())
  })

  it('should return 200 if UserAvatarUseCase is success', async () => {
    const httpRequest = makerHttpRequest()

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).not.toBeUndefined()
  })
})
