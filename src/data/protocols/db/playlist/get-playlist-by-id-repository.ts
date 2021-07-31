import { PlaylistEntity } from '@/data/entities'

export interface GetPlaylistByIdRepository {
  getById: (
    playlistId: string,
    strategy: GetPlaylistByIdRepository.Config
  ) => Promise<GetPlaylistByIdRepository.Result>
}

// eslint-disable-next-line no-redeclare
export namespace GetPlaylistByIdRepository {
  export type Config = {
    includeEstablishment?: boolean
    includeEstablishmentAndManager?: boolean
    includeMusics?: boolean
    includeCurrentMusic?: boolean
    includeMusicToPlaylist?: boolean
  }
  export type Result = PlaylistEntity
}
