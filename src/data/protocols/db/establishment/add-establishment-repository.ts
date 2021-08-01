import { EstablishmentEntity } from '@/data/entities'

export interface AddEstablishmentRepository {
  save: (
    establishment: EstablishmentEntity
  ) => Promise<AddEstablishmentRepository.Result>
}

export namespace AddEstablishmentRepository {
  export type Result = EstablishmentEntity
}
