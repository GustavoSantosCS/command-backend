import { RequestProductEntity } from '@/data/entities'

export interface CreateRequestProductRepository {
  save: (
    newRequestProduct: CreateRequestProductRepository.Param
  ) => Promise<CreateRequestProductRepository.Return>
}

export namespace CreateRequestProductRepository {
  export type Param = RequestProductEntity
  export type Return = RequestProductEntity
}
