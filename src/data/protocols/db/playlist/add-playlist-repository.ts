import { MusicEntity, PlaylistEntity } from '@/data/entities';
import { PlayListModel } from '@/domain/models';

export interface AddPlayListRepository {
  add(
    data: AddPlayListRepository.Params,
    establishmentId: string,
    playlist: PlayListModel
  ): Promise<Omit<PlaylistEntity, 'establishment' | 'musicToPlaylist'>>;
}

// eslint-disable-next-line no-redeclare
export namespace AddPlayListRepository {
  export type Params = {
    id: string;
    position: number;
    music: MusicEntity;
    playlist: PlaylistEntity;
  }[];
}
