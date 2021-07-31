import { EstablishmentEntity } from '@/data/entities'

export interface GetAllEstablishmentsUserRepository {
  getAllEstablishmentsUser: (
    userId: string
  ) => Promise<GetAllEstablishmentsUserRepository.Result>
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentsUserRepository {
  export type Result = Array<Omit<
  EstablishmentEntity,
  'manager' | 'products' | 'playlists' | 'accounts' | 'surveys' | 'musics'
  >>
}
