/* eslint-disable no-redeclare */
import { MusicPlaylistEntity } from '@/data/entities';
import { PlaylistNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface StartPlaylistMusicUseCase {
  startMusic(
    data: StartPlaylistMusicUseCase.Param
  ): Promise<StartPlaylistMusicUseCase.Result>;
}

export namespace StartPlaylistMusicUseCase {
  export type Param = {
    playlistId: string;
    userId: string;
    establishmentId: string;
  };

  export type Return = MusicPlaylistEntity;
  export type Result = Either<PlaylistNotFoundError, Return>;
}
