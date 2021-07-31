import { UserEntity } from '@/data/entities'
import { SearchUserByEmailRepository } from '@/data/protocols'
import { makeMockUser } from '@tests/domain/mock/models'

export class SearchUserByEmailRepositorySpy
implements SearchUserByEmailRepository {
  parameters: string
  error: Error
  return: UserEntity | null = makeMockUser({ id: true })
  calls = 0

  throwsError () {
    this.error = new Error('any_message')
  }

  async searchByEmail (
    email: SearchUserByEmailRepository.Params
  ): Promise<SearchUserByEmailRepository.Result> {
    this.calls += 1
    this.parameters = email
    if (this.error) throw this.error
    return this.return
  }
}
