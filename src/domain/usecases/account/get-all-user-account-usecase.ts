import { AccountEntity } from '@/data/entities'

export interface GetAllUserAccountUseCase {
  getAllUserAccount: (
    userId: string
  ) => Promise<GetAllUserAccountUseCase.Result>
}

export namespace GetAllUserAccountUseCase {
  export type Result = Array<Omit<AccountEntity, 'user' | 'requestsProduct'>>
}
