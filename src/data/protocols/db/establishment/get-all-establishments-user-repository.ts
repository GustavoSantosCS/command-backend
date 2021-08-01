import { EstablishmentEntity } from '@/data/entities'

export interface GetAllEstablishmentsUserRepository {
  getAllEstablishmentsUser: (
    userId: string
  ) => Promise<GetAllEstablishmentsUserRepository.Result>
}

export namespace GetAllEstablishmentsUserRepository {
  export type Result = Array<
    Omit<
      EstablishmentEntity,
      'manager' | 'products' | 'playlists' | 'accounts' | 'surveys' | 'musics'
    >
  >
}
