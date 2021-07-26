import { AccountEntity } from '@/data/entities';

export interface GetAllUserAccountRepository {
  getAllUserAccount(
    userId: string
  ): Promise<
    Omit<AccountEntity, 'user' | 'requestsProduct' | 'requestsMusic'>[]
  >;
}
