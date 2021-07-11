import { RequestProductEntity } from '@/data/entities';
import { RequestProductModel } from '@/domain/models';

export interface CreateRequestProductRepository {
  save(
    newRequestProduct: Omit<RequestProductModel, 'product' | 'account'>,
    productId: string,
    accountId: string
  ): Promise<RequestProductEntity>;
}
