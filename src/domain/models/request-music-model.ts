import { AccountModel } from './account-model';
import { MusicModel } from './music-model';

export type RequestMusicModel = {
  id: string;
  music: MusicModel;
  account: AccountModel;
  createdAt: Date;
};
