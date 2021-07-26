import { PlaylistEntity } from '@/data/entities';

export interface GetCurrentEstablishmentPlaylistRepository {
  getEstablishmentPlaylist(
    establishmentId: string
  ): Promise<Omit<PlaylistEntity, 'establishment' | 'musics'>>;
}
