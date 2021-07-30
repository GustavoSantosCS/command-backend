import { EstablishmentEntity, MusicEntity } from '@/data/entities';

export type PlayListModel = {
  id: string;
  name: string;
  establishment: EstablishmentEntity;
  isActive: boolean;
  musics?: MusicEntity[];
  createdAt?: Date;
  updatedAt?: Date;
};
