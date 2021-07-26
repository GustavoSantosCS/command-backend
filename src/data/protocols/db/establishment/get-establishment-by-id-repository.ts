import { EstablishmentEntity } from '@/data/entities';

export interface GetEstablishmentByIdRepository {
  getById(
    establishmentId: string
  ): Promise<GetEstablishmentByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetEstablishmentByIdRepository {
  export type Result = Omit<
    EstablishmentEntity,
    'products' | 'playlists' | 'accounts' | 'surveys' | 'musics'
  >;
}
