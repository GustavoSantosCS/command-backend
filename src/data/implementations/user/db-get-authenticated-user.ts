import { GetUserByIdRepository } from '@/data/protocols'
import { GetAuthenticatedUserUseCase } from '@/domain/usecases'
import { UserNotFoundError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class DBGetAuthenticatedUser implements GetAuthenticatedUserUseCase {
  private readonly getByIdRepo: GetUserByIdRepository

  constructor(getByIdRepo: GetUserByIdRepository) {
    this.getByIdRepo = getByIdRepo
  }

  async getAuthenticatedUser(
    userId: string
  ): Promise<GetAuthenticatedUserUseCase.Result> {
    const user = await this.getByIdRepo.getById(userId, { withAvatar: true })

    if (!user) {
      return left(new UserNotFoundError())
    }

    return right(user)
  }
}
