import { GetUserByIdRepository } from '@/data/protocols'
import { GetAuthenticatedUserUseCase } from '@/domain/usecases'
import { UserNotFoundError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class DBGetAuthenticatedUser implements GetAuthenticatedUserUseCase {
  private readonly getByIdRepo: GetUserByIdRepository

  constructor (getByIdRepo: GetUserByIdRepository) {
    this.getByIdRepo = getByIdRepo
  }

  async getAuthenticatedUser (
    userId: string
  ): Promise<GetAuthenticatedUserUseCase.Result> {
    const user = await this.getByIdRepo.getById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const result: GetAuthenticatedUserUseCase.Return = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    return right(result)
  }
}
