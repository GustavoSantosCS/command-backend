import { EstablishmentModel } from './establishment-model';
import { PlayListModel } from './playlist-model';

export type MusicModel = {
  id: string;
  name: string;
  talent: string;
  duration: number;
  establishment?: EstablishmentModel;
  playlists?: PlayListModel[];
  createdAt?: Date;
  updatedAt?: Date;
};
