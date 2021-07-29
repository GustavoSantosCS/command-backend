import { AccountEntity } from '@/data/entities';

export interface GetAllUserAccountRepository {
  getAllUserAccount(
    userId: string
  ): Promise<Omit<AccountEntity, 'requestsProduct' | 'requestsMusic'>[]>;
}
