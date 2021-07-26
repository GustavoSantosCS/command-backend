import { ProductEntity } from '@/data/entities';
import { ProductModel } from '@/domain/models';

export interface AddProductRepository {
  save(
    product: ProductModel,
    establishmentId: string
  ): Promise<Omit<ProductEntity, 'establishment'>>;
}
