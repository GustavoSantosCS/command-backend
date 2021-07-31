import { left, right } from '@/shared/either'
import { EmailAlreadyUseError } from '@/domain/errors'
import { makeMockUser } from '@tests/domain/mock/models'
import { AddUserUseCase } from '@/domain/usecases'
import { AppError } from '@/shared/errors'

type Returns = {
  right: AddUserUseCase.Response
  left: AddUserUseCase.Response
}

export class AddUserUseCaseSpy implements AddUserUseCase {
  returns: Returns = {
    right: right(makeMockUser({ id: true, avatar: false })),
    left: left(new EmailAlreadyUseError(''))
  }

  return = this.returns.right
  parameters = null
  error: AppError

  throwError() {
    this.error = new AppError('any_message')
  }

  async save(newUser: AddUserUseCase.Params): Promise<AddUserUseCase.Response> {
    if (this.error) throw this.error
    this.parameters = newUser

    if (this.return.isLeft()) {
      this.return = left(new EmailAlreadyUseError(newUser.email))
    }

    return this.return
  }
}
