import { Either } from '@/shared/either';
import { MusicEntity } from '@/data/entities';
import { EstablishmentNotFoundError } from '@/domain/errors';

export interface AddMusicUseCase {
  add(data: AddMusicUseCase.Params): Promise<AddMusicUseCase.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace AddMusicUseCase {
  export type Params = {
    userId: string;
    establishmentId: string;
    name: string;
    talent: string;
    duration: number;
  };

  export type Return = Omit<
    MusicEntity,
    'establishment' | 'playlists' | 'surveys' | 'musicToPlaylist'
  >;

  export type Result = Either<EstablishmentNotFoundError, Return>;
}
