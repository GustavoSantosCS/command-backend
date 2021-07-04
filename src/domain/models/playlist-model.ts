import { EstablishmentModel } from './establishment-model';
import { MusicModel } from './music-model';

export type PlayListModel = {
  id: string;
  name: string;
  establishment: EstablishmentModel;
  isActive: boolean;
  musics?: MusicModel[];
  createdAt?: Date;
  updatedAt?: Date;
};
