import { AccountEntity } from '@/data/entities';

export interface GetAllUserAccountUseCase {
  getAllUserAccount(userId: string): Promise<GetAllUserAccountUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAllUserAccountUseCase {
  export type Result = Omit<
    AccountEntity,
    'user' | 'requestsProduct' | 'requestsMusic'
  >[];
}
