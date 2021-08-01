import { MusicPlaylistEntity } from '@/data/entities'
import {
  PlaylistIsNotActiveError,
  PlaylistNotFoundError
} from '@/domain/errors'
import { Either } from '@/shared/either'

export interface NextPlaylistMusicUseCase {
  nextMusic: (
    data: NextPlaylistMusicUseCase.Param
  ) => Promise<NextPlaylistMusicUseCase.Result>
}

export namespace NextPlaylistMusicUseCase {
  export type Param = {
    playlistId: string
    userId: string
    establishmentId: string
  }

  export type Return = MusicPlaylistEntity | null
  export type Result = Either<
    PlaylistNotFoundError | PlaylistIsNotActiveError,
    Return
  >
}
