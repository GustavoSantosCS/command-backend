import { ProductEntity } from '@/data/entities'

export interface GetProductByIdRepository {
  getById: (
    id: string,
    config?: GetProductByIdRepository.Config
  ) => Promise<ProductEntity>
}

// eslint-disable-next-line no-redeclare
export namespace GetProductByIdRepository {
  export type Config = {
    whitEstablishment: boolean
  }
}
