import { PlaylistEntity } from '@/data/entities';

export interface GetPlaylistByIdRepository {
  getPlaylistById(
    playlistId: string,
    strategy: GetPlaylistByIdRepository.Config
  ): Promise<GetPlaylistByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace GetPlaylistByIdRepository {
  export type Config = {
    includeEstablishment?: boolean;
    includeEstablishmentAndManager?: boolean;
    includeMusics?: boolean;
    justPlaylist?: boolean;
  };
  export type Result = PlaylistEntity;
}
