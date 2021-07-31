import { UserAvatarRepository } from '@/data/protocols'
import { makeMockAvatarUser } from '@tests/domain/mock/models'

export class UserAvatarRepositorySpy implements UserAvatarRepository {
  parameters: any
  error: Error
  calls = 0
  return: UserAvatarRepository.Result = makeMockAvatarUser()
  throwsError () {
    this.error = new Error('any_message')
  }

  async saveAvatar (
    newAvatar: UserAvatarRepository.Params
  ): Promise<UserAvatarRepository.Result> {
    this.calls += 1
    this.parameters = newAvatar
    if (this.error) throw this.error
    return this.return
  }
}
