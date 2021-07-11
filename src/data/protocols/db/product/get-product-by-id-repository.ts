import { ProductEntity } from '@/data/entities';

export interface GetProductByIdRepository {
  getById(id: string): Promise<ProductEntity>;
}
