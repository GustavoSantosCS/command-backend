import { MusicEntity } from '@/data/entities';

export interface AddMusicRepository {
  save(newMusic: MusicEntity): Promise<MusicEntity>;
}
