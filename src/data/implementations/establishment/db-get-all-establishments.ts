import { GetAllEstablishmentsRepository } from '@/data/protocols'
import { GetAllEstablishmentsUseCase } from '@/domain/usecases'

export class DBGetAllEstablishments implements GetAllEstablishmentsUseCase {
  private readonly getAllEstablishmentsRepo: GetAllEstablishmentsRepository

  constructor (getAllEstablishmentsRepo: GetAllEstablishmentsRepository) {
    this.getAllEstablishmentsRepo = getAllEstablishmentsRepo
  }

  async getAll (): Promise<GetAllEstablishmentsUseCase.Response> {
    const establishments = await this.getAllEstablishmentsRepo.getAll()
    return establishments
  }
}
