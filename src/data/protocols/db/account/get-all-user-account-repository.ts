import { AccountEntity } from '@/data/entities'

export interface GetAllUserAccountRepository {
  getAllUserAccount: (
    userId: string
  ) => Promise<Array<Omit<AccountEntity, 'requestsProduct'>>>
}
