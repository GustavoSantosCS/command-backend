import { ProductEntity } from '@/data/entities';

export interface GetProductByIdRepository {
  getProductById(id: string): Promise<ProductEntity>;
}
