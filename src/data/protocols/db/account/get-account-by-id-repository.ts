import { AccountEntity } from '@/data/entities';

export interface GetAccountByIdRepository {
  getById(accountId: string): Promise<GetAccountByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAccountByIdRepository {
  export type Result = Omit<
    AccountEntity,
    'client' | 'establishment' | 'requestsProduct' | 'requestsMusic'
  >;
}
