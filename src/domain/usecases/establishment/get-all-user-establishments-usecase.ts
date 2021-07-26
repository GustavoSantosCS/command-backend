import { EstablishmentEntity } from '@/data/entities';

export interface GetAllUserEstablishmentsUseCase {
  getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAllUserEstablishmentsUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAllUserEstablishmentsUseCase {
  export type Response = Omit<
    EstablishmentEntity,
    | 'manager'
    | 'products'
    | 'playlists'
    | 'accounts'
    | 'surveys'
    | 'musics'
    | 'deletedAt'
  >[];
}
