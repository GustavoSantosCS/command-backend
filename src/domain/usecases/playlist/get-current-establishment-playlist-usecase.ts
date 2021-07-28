import { PlaylistEntity } from '@/data/entities';
import { Either } from '@/shared/either';
import {
  EstablishmentNotFoundError,
  EstablishmentNotHavePlaylistError
} from '@/domain/errors';

export interface GetCurrentEstablishmentPlaylistUseCase {
  getCurrentPlaylist(
    userId: string,
    establishmentId: string
  ): Promise<GetCurrentEstablishmentPlaylistUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace GetCurrentEstablishmentPlaylistUseCase {
  export type Result = Omit<PlaylistEntity, 'establishment' | 'musics'>;

  export type Response = Either<
    EstablishmentNotFoundError | EstablishmentNotHavePlaylistError,
    Result
  >;
}
