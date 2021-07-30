import { AccountEntity, MusicEntity } from '@/data/entities';

export type RequestMusicModel = {
  id: string;
  music: MusicEntity;
  account: AccountEntity;
  createdAt: Date;
};
