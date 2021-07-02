import { PlaylistEntity } from '@/data/entities';
import { PlayListModel } from '@/domain/models';

export interface AddPlayListRepository {
  add(
    playlistModel: PlayListModel
  ): Promise<Omit<PlaylistEntity, 'establishment'>>;
}
