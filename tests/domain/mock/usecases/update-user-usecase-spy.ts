import { UpdateUserUseCase } from '@/domain/usecases'
import { AppError } from '@/shared/errors'

export class UpdateUserUseCaseSpy implements UpdateUserUseCase {
  return: UpdateUserUseCase.Response = null
  parameters = null
  calls = 0
  error: AppError

  throwError() {
    this.error = new AppError('any_message')
  }

  async update(newUserData: any): Promise<UpdateUserUseCase.Response> {
    this.parameters = newUserData
    this.calls += 1
    if (this.error) throw this.error
    return this.return
  }
}
