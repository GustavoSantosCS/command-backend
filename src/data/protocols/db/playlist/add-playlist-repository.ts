import { MusicPlaylistEntity, PlaylistEntity } from '@/data/entities'

export interface AddPlayListRepository {
  save: (
    playlist: PlaylistEntity,
    newMusics: MusicPlaylistEntity[]
  ) => Promise<AddPlayListRepository.Result>
}

export namespace AddPlayListRepository {
  export type Result = Omit<PlaylistEntity, 'establishment' | 'musics'>
}
