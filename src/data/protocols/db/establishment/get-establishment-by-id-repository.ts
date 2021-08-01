import { EstablishmentEntity } from '@/data/entities'

export interface GetEstablishmentByIdRepository {
  getById: (
    establishmentId: string,
    config?: GetEstablishmentByIdRepository.Config
  ) => Promise<GetEstablishmentByIdRepository.Result>
}

export namespace GetEstablishmentByIdRepository {
  export type Result = EstablishmentEntity
  export type Config = {
    withManager?: boolean
    withImage?: boolean
  }
}
