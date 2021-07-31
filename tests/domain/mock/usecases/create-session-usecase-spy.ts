import { right } from '@/shared/either'
import { CreateSessionUseCase } from '@/domain/usecases'
import { AppError } from '@/shared/errors'
import { makeMockUser } from '../models'

export class CreateSessionUseCaseSpy implements CreateSessionUseCase {
  return: CreateSessionUseCase.Result = right({
    token: 'token',
    user: makeMockUser({ id: true })
  })

  parameters = null
  error: AppError
  calls = 0

  throwError() {
    this.error = new AppError('any_message')
  }

  async createSession(
    data: CreateSessionUseCase.Params
  ): Promise<CreateSessionUseCase.Result> {
    this.parameters = data
    this.calls += 1
    if (this.error) throw this.error

    return this.return
  }
}
