import { EstablishmentModel } from './establishment-model';

export type MusicModel = {
  id: string;
  name: string;
  talent: string;
  duration: number;
  establishment?: EstablishmentModel;
  createdAt?: Date;
  updatedAt?: Date;
};
