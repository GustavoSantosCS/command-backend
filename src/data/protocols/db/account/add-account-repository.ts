import { AccountEntity } from '@/data/entities';

export interface AddAccountRepository {
  add(account: AccountEntity): Promise<AccountEntity>;
}
