import { PlaylistEntity } from '@/data/entities';

export interface GetCurrentEstablishedPlaylistRepository {
  getEstablishedPlaylist(establishmentId: string): Promise<PlaylistEntity>;
}
