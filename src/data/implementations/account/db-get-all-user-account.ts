import { GetAllUserAccountRepository } from '@/data/protocols';
import { GetAllUserAccountUseCase } from '@/domain/usecases';

export class DBGetAllUserAccount implements GetAllUserAccountUseCase {
  private getAllUserAccountRepo: GetAllUserAccountRepository;

  constructor(getAllUserAccountRepo: GetAllUserAccountRepository) {
    this.getAllUserAccountRepo = getAllUserAccountRepo;
  }

  async getAllUserAccount(
    userId: string
  ): Promise<GetAllUserAccountUseCase.Result> {
    return this.getAllUserAccountRepo.getAllUserAccount(userId);
  }
}
