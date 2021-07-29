import { AccountEntity } from '@/data/entities';
import { MusicModel } from './music-model';

export type RequestMusicModel = {
  id: string;
  music: MusicModel;
  account: AccountEntity;
  createdAt: Date;
};
