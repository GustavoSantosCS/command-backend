import { EstablishmentModel } from './establishment-model';

export type PlayListModel = {
  id: string;
  name: string;
  establishment: EstablishmentModel;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
