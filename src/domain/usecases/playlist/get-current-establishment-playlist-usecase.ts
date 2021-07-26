import { PlaylistEntity } from '@/data/entities';
import { Either } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';

export interface GetCurrentEstablishmentPlaylistUseCase {
  getCurrentPlaylist(
    userId: string,
    establishmentId: string
  ): Promise<
    Either<
      EstablishmentNotFoundError,
      Omit<PlaylistEntity, 'establishment' | 'musicToPlaylist'>
    >
  >;
}

// eslint-disable-next-line no-redeclare
export namespace GetCurrentEstablishmentPlaylistUseCase {
  export type Result = Omit<
    PlaylistEntity,
    'establishment' | 'musicToPlaylist'
  >;

  export type Response = Either<EstablishmentNotFoundError, Result>;
}
