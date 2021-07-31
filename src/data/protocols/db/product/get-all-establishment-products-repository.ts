import { ProductEntity } from '@/data/entities'

export interface GetAllEstablishmentProductsRepository {
  getAllEstablishmentProducts: (
    establishmentId: string
  ) => Promise<Array<Omit<ProductEntity, 'establishment'>>>
}
