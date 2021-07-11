import { RequestProductEntity } from '@/data/entities';

export interface GetAllAccountRequestProductRepository {
  getAllAccountRequestProduct(idAccount): Promise<RequestProductEntity[]>;
}
