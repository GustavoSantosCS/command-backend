import { UserEntity } from '@/data/entities'
import { SearchUserByEmailRepository } from '@/data/protocols'
import { makeMockUser } from '@tests/domain/mock/models'

export class SearchUserByEmailRepositorySpy
  implements SearchUserByEmailRepository
{
  parameters: any
  config: any
  error: Error
  return: UserEntity | null = makeMockUser({ id: true })
  calls = 0

  throwsError() {
    this.error = new Error('any_message')
  }

  async searchByEmail(
    email: SearchUserByEmailRepository.Params,
    config?: SearchUserByEmailRepository.Config
  ): Promise<SearchUserByEmailRepository.Result> {
    this.calls += 1
    this.parameters = email
    this.config = config
    if (this.error) throw this.error
    return this.return
  }
}
