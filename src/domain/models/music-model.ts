import { EstablishmentEntity } from '@/data/entities';
import { PlayListModel } from './playlist-model';

export type MusicModel = {
  id: string;
  name: string;
  talent: string;
  duration: number;
  establishment?: EstablishmentEntity;
  playlists?: PlayListModel[];
  createdAt?: Date;
  updatedAt?: Date;
};
