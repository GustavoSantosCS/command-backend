import { EstablishmentEntity } from '@/data/entities';
import { EstablishmentModel } from '@/domain/models';

export interface AddEstablishmentRepository {
  save(
    userId: string,
    establishmentModel: EstablishmentModel
  ): Promise<AddEstablishmentRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace AddEstablishmentRepository {
  export type Result = Omit<
    EstablishmentEntity,
    | 'manager'
    | 'products'
    | 'playlists'
    | 'accounts'
    | 'surveys'
    | 'musics'
    | 'deletedAt'
  >;
}
