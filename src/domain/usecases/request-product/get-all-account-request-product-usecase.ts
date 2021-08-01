import { RequestProductEntity } from '@/data/entities'
import { AccountNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface GetAllAccountRequestProductUseCase {
  getAllAccountRequestsProduct: (
    data: GetAllAccountRequestProductUseCase.Params
  ) => Promise<GetAllAccountRequestProductUseCase.Result>
}

export namespace GetAllAccountRequestProductUseCase {
  export type Params = {
    accountId: string
    userId: string
  }
  export type Return = Array<Omit<RequestProductEntity, 'account' | 'closedAt'>>

  export type Result = Either<AccountNotFoundError, Return>
}
