import { ProductEntity } from '@/data/entities'

export interface GetProductByIdRepository {
  getById: (
    id: string,
    config?: GetProductByIdRepository.Config
  ) => Promise<ProductEntity>
}

export namespace GetProductByIdRepository {
  export type Config = {
    whitEstablishment: boolean
  }
}
