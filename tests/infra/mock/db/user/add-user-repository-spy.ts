import { AddUserRepository } from '@/data/protocols'
import { makeMockUser } from '@tests/domain/mock/models'

export class AddUserRepositorySpy implements AddUserRepository {
  parameters: any
  error: Error
  return: AddUserRepository.Result = makeMockUser({ id: true })

  throwsError () {
    this.error = new Error('any_message')
  }

  async save (
    user: AddUserRepository.Params
  ): Promise<AddUserRepository.Result> {
    this.parameters = user
    if (this.error) throw this.error
    return this.return
  }
}
