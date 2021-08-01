import { CATEGORY, ImagePersistenceData } from '@/domain/models'
import { EstablishmentEntity } from '@/data/entities'

export interface AddEstablishmentUseCase {
  add: (
    newEstablishment: AddEstablishmentUseCase.Params
  ) => Promise<AddEstablishmentUseCase.Response>
}

export namespace AddEstablishmentUseCase {
  export type Params = {
    userId: string
    establishment: {
      name: string
      category: CATEGORY
      description: string
    }
    establishmentImage: ImagePersistenceData
  }

  export type Return = Omit<
    EstablishmentEntity,
    | 'manager'
    | 'products'
    | 'playlists'
    | 'accounts'
    | 'surveys'
    | 'musics'
    | 'deletedAt'
  >

  export type Response = Return
}
