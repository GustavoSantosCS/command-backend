import { RequestProductEntity } from '@/data/entities';

export interface GetAllAccountRequestProductRepository {
  getAllAccountRequestsProduct(
    accountId
  ): Promise<Omit<RequestProductEntity, 'account'>[]>;
}
