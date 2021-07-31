import { ProductEntity } from '@/data/entities'

export interface AddProductRepository {
  save: (product: ProductEntity) => Promise<ProductEntity>
}
