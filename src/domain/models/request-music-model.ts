import { MusicModel } from './music-model';

export type RequestMusicModel = {
  id: string;
  music: MusicModel;
  createdAt: Date;
}