import { EstablishmentEntity } from '@/data/entities'

export interface GetEstablishmentByIdRepository {
  getById: (
    establishmentId: string,
    config?: GetEstablishmentByIdRepository.Config
  ) => Promise<GetEstablishmentByIdRepository.Result>
}

// eslint-disable-next-line no-redeclare
export namespace GetEstablishmentByIdRepository {
  export type Result = EstablishmentEntity
  export type Config = {
    withManager?: boolean
    withImage?: boolean
  }
}
