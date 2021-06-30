import { ProductEntity } from '@/data/entities';

export interface GetAllEstablishmentProductsRepository {
  getAllEstablishmentProducts(
    idEstablishment: string
  ): Promise<ProductEntity[]>;
}
