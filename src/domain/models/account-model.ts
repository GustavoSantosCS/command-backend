import { EstablishmentModel } from './establishment-model';
import { RequestProductModel } from './request-product-model';
import { RequestMusicModel } from './request-music-model';
import { UserModel } from './user-model';

export type AccountModel = {
  id: string;
  client: UserModel;
  establishment: EstablishmentModel;
  requestsProduct: RequestProductModel[];
  requestsMusic: RequestMusicModel[];
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
};
