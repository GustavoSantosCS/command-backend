import { GetAllEstablishmentsRepository } from '@/data/protocols';
import { GetAllEstablishmentsUseCase } from '@/domain/usecases';

export class DBGetAllEstablishments implements GetAllEstablishmentsUseCase {
  private readonly getAllEstablishmentsRepo: GetAllEstablishmentsRepository;

  constructor(getAllEstablishmentsRepo: GetAllEstablishmentsRepository) {
    this.getAllEstablishmentsRepo = getAllEstablishmentsRepo;
  }

  async getAllEstablishments(): Promise<GetAllEstablishmentsUseCase.Response> {
    const establishments =
      await this.getAllEstablishmentsRepo.getAllEstablishments();
    return establishments;
  }
}
