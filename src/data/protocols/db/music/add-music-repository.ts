import { MusicEntity } from '@/data/entities';
import { MusicModel } from '@/domain/models';

export interface AddMusicRepository {
  add(
    musicModel: MusicModel,
    establishmentId: string
  ): Promise<
    Omit<
      MusicEntity,
      'establishment' | 'playlists' | 'surveys' | 'musicToPlaylist'
    >
  >;
}
