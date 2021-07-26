import { GetAllEstablishmentsUserRepository } from '@/data/protocols';
import { GetAllUserEstablishmentsUseCase } from '@/domain/usecases';

export class DBGetAllEstablishmentsUser
  implements GetAllUserEstablishmentsUseCase
{
  private readonly getAllEstablishmentsUserRepo: GetAllEstablishmentsUserRepository;

  constructor(
    getAllEstablishmentsUserRepo: GetAllEstablishmentsUserRepository
  ) {
    this.getAllEstablishmentsUserRepo = getAllEstablishmentsUserRepo;
  }

  async getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAllUserEstablishmentsUseCase.Response> {
    const establishments =
      await this.getAllEstablishmentsUserRepo.getAllEstablishmentsUser(userId);
    return establishments;
  }
}
