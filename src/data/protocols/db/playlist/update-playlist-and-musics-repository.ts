import {
  MusicEntity,
  MusicPlaylistEntity,
  PlaylistEntity
} from '@/data/entities'

export interface UpdatePlaylistAndMusicsRepository {
  updateMusics: (
    playlist: PlaylistEntity,
    newMusics: MusicPlaylistEntity[]
  ) => Promise<UpdatePlaylistAndMusicsRepository.Result>
}

export namespace UpdatePlaylistAndMusicsRepository {
  export type Musics = Array<{
    id: string
    position: number
    music: MusicEntity
    playlist: PlaylistEntity
  }>
  export type Result = Omit<PlaylistEntity, 'musics'>
}
