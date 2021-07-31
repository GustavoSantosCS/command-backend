import { MusicPlaylistEntity } from '@/data/entities'
import { PlaylistNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface StopPlaylistMusicUseCase {
  stopMusic: (
    data: StopPlaylistMusicUseCase.Param,
  ) => Promise<StopPlaylistMusicUseCase.Result>
}

export namespace StopPlaylistMusicUseCase {
  export type Param = {
    playlistId: string
    userId: string
    establishmentId: string
  }

  export type Return = MusicPlaylistEntity
  export type Result = Either<PlaylistNotFoundError, Return>
}
