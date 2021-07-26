import {
  MusicEntity,
  MusicPlaylistEntity,
  PlaylistEntity
} from '@/data/entities';

export interface UpdatePlaylistAndMusicsRepository {
  updateMusicsOfPlaylist(
    playlist: PlaylistEntity,
    newMusics: MusicPlaylistEntity[]
  ): Promise<UpdatePlaylistAndMusicsRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdatePlaylistAndMusicsRepository {
  export type Musics = {
    id: string;
    position: number;
    music: MusicEntity;
    playlist: PlaylistEntity;
  }[];
  export type Result = Omit<PlaylistEntity, 'musics'>;
}
