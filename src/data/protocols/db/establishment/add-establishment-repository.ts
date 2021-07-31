import { EstablishmentEntity } from '@/data/entities'

export interface AddEstablishmentRepository {
  save: (
    establishment: EstablishmentEntity
  ) => Promise<AddEstablishmentRepository.Result>
}

// eslint-disable-next-line no-redeclare
export namespace AddEstablishmentRepository {
  export type Result = EstablishmentEntity
}
