import { MusicPlaylistEntity, PlaylistEntity } from '@/data/entities';

export interface SaveCurrentMusicPlaylistRepository {
  saveCurrentMusicPlaylist(
    playlist: PlaylistEntity,
    newCurrentPlaylist: MusicPlaylistEntity
  ): Promise<MusicPlaylistEntity>;
}
