import { CATEGORY, EstablishmentImageModel } from '@/domain/models';
import { EstablishmentEntity } from '@/data/entities';

export interface AddEstablishmentUseCase {
  addEstablishment(
    newEstablishment: AddEstablishmentUseCase.Params
  ): AddEstablishmentUseCase.Response;
}

// eslint-disable-next-line no-redeclare
export namespace AddEstablishmentUseCase {
  export type Params = {
    userId: string;
    establishment: {
      name: string;
      category: CATEGORY;
      description: string;
    };
    establishmentImage: EstablishmentImageModel;
  };

  export type Response = Promise<
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
  >;
}
