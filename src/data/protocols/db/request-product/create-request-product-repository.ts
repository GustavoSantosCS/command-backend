import { RequestProductEntity } from '@/data/entities'

export interface CreateRequestProductRepository {
  save: (
    newRequestProduct: CreateRequestProductRepository.Param
  ) => Promise<CreateRequestProductRepository.Return>
}

// eslint-disable-next-line no-redeclare
export namespace CreateRequestProductRepository {
  export type Param = RequestProductEntity
  export type Return = RequestProductEntity
}
