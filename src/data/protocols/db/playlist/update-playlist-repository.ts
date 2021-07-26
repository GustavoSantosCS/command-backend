import { PlaylistEntity } from '@/data/entities';

export interface UpdatePlaylistRepository {
  updatePlaylist(
    newDatePlaylist: PlaylistEntity
  ): Promise<UpdatePlaylistRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace UpdatePlaylistRepository {
  export type Result = Omit<PlaylistEntity, 'musicToPlaylist'>;
}
