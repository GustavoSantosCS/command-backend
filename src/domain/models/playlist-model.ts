import { EstablishmentEntity } from '@/data/entities';
import { MusicModel } from './music-model';

export type PlayListModel = {
  id: string;
  name: string;
  establishment: EstablishmentEntity;
  isActive: boolean;
  musics?: MusicModel[];
  createdAt?: Date;
  updatedAt?: Date;
};
