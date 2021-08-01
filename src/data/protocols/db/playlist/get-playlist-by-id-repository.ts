import { PlaylistEntity } from '@/data/entities'

export interface GetPlaylistByIdRepository {
  getById: (
    playlistId: string,
    strategy: GetPlaylistByIdRepository.Config
  ) => Promise<GetPlaylistByIdRepository.Result>
}

export namespace GetPlaylistByIdRepository {
  export type Config = {
    withEstablishment?: boolean
    withEstablishmentAndManager?: boolean
    withMusics?: boolean
    withCurrentMusic?: boolean
    withMusicToPlaylist?: boolean
  }
  export type Result = PlaylistEntity
}
