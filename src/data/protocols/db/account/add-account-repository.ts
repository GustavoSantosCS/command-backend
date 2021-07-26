import { AccountEntity } from '@/data/entities';
import { AccountModel } from '@/domain/models';

export interface AddAccountRepository {
  add(
    account: Omit<AccountModel, 'client'>,
    userId: string
  ): Promise<AccountEntity>;
}
