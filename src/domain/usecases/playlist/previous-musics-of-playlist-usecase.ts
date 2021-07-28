/* eslint-disable no-redeclare */
import { MusicPlaylistEntity } from '@/data/entities';
import { PlaylistNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface PreviousPlaylistMusicUseCase {
  previousMusic(
    data: PreviousPlaylistMusicUseCase.Param
  ): Promise<PreviousPlaylistMusicUseCase.Result>;
}

export namespace PreviousPlaylistMusicUseCase {
  export type Param = {
    playlistId: string;
    userId: string;
    establishmentId: string;
  };

  export type Return = MusicPlaylistEntity | null;
  export type Result = Either<PlaylistNotFoundError, Return>;
}
