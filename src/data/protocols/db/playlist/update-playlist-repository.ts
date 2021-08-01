import { PlaylistEntity } from '@/data/entities'

export interface UpdatePlaylistRepository {
  update: (
    newDatePlaylist: PlaylistEntity
  ) => Promise<UpdatePlaylistRepository.Result>
}

export namespace UpdatePlaylistRepository {
  export type Result = Omit<PlaylistEntity, 'musicToPlaylist'>
}
