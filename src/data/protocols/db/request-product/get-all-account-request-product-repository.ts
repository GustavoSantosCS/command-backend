import { RequestProductEntity } from '@/data/entities'

export interface GetAllAccountRequestProductRepository {
  getAllAccountRequestsProduct: (
    accountId
  ) => Promise<Array<Omit<RequestProductEntity, 'account'>>>
}
