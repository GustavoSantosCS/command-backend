import { MusicEntity } from '@/data/entities';

export interface GetMusicByIdRepository {
  getById(id: string): Promise<MusicEntity>;
}
