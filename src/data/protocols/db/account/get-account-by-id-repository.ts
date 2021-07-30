import { AccountEntity } from '@/data/entities';

export interface GetAccountByIdRepository {
  getById(
    accountId: string,
    config?: GetAccountByIdRepository.Config
  ): Promise<AccountEntity>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAccountByIdRepository {
  export type Config = {
    withClient?: boolean;
    withEstablishment?: boolean;
  };
}
