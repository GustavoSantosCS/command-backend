import { AccountEntity } from '@/data/entities'

export interface AddAccountRepository {
  save: (account: AccountEntity) => Promise<AccountEntity>
}
