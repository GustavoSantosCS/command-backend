import { MusicPlaylistEntity, PlaylistEntity } from '@/data/entities'

export interface SaveCurrentMusicPlaylistRepository {
  saveCurrentMusic: (
    playlist: PlaylistEntity,
    newCurrentPlaylist: MusicPlaylistEntity
  ) => Promise<MusicPlaylistEntity>
}
