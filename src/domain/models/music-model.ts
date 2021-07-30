import { EstablishmentEntity, PlaylistEntity } from '@/data/entities';

export type MusicModel = {
  id: string;
  name: string;
  talent: string;
  duration: number;
  establishment?: EstablishmentEntity;
  playlists?: PlaylistEntity[];
  createdAt?: Date;
  updatedAt?: Date;
};
