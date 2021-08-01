import { EstablishmentEntity } from '@/data/entities'

export interface GetAllEstablishmentsUseCase {
  getAll: () => Promise<GetAllEstablishmentsUseCase.Response>
}

export namespace GetAllEstablishmentsUseCase {
  export type Response = Array<
    Omit<
      EstablishmentEntity,
      | 'manager'
      | 'products'
      | 'playlists'
      | 'accounts'
      | 'surveys'
      | 'musics'
      | 'deletedAt'
    >
  >
}
