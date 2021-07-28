import { MusicPlaylistEntity, PlaylistEntity } from '@/data/entities';

export interface AddPlayListRepository {
  add(
    playlist: PlaylistEntity,
    newMusics: MusicPlaylistEntity[]
  ): Promise<AddPlayListRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace AddPlayListRepository {
  export type Result = Omit<PlaylistEntity, 'establishment' | 'musics'>;
}
