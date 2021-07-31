import { GetEstablishmentByIdRepository } from '@/data/protocols'
import { GetUserEstablishmentByIdUseCase } from '@/domain/usecases'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class DBGetUserEstablishmentById
implements GetUserEstablishmentByIdUseCase {
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository

  constructor (getEstablishmentByIdRepo: GetEstablishmentByIdRepository) {
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo
  }

  async getUserEstablishmentById (
    userId: string,
    establishmentId: string
  ): Promise<GetUserEstablishmentByIdUseCase.Response> {
    const establishmentRepo = await this.getEstablishmentByIdRepo.getById(
      establishmentId,
      { withManager: true, withImage: true }
    )

    if (establishmentRepo?.manager.id !== userId) {
      return left(new EstablishmentNotFoundError())
    }

    return right(establishmentRepo)
  }
}
