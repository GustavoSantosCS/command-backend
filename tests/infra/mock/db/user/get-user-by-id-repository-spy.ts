import { UserEntity } from '@/data/entities'
import { GetUserByIdRepository } from '@/data/protocols'
import { makeMockUser } from '@tests/domain/mock/models'

export class GetUserByIdRepositorySpy implements GetUserByIdRepository {
  parameters: string
  error: Error
  return: UserEntity | null = makeMockUser({ id: true })
  calls = 0

  throwsError () {
    this.error = new Error('any_message')
  }

  async getById (
    id: GetUserByIdRepository.Params
  ): Promise<GetUserByIdRepository.Result> {
    this.calls += 1
    this.parameters = id
    if (this.error) throw this.error
    this.return.id = id
    return this.return
  }
}
