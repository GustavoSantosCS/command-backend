import { PlaylistEntity } from '@/data/entities';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetCurrentEstablishedPlaylistUseCase {
  getCurrentPlaylist(
    userId: string,
    establishmentId: string
  ): Promise<Either<AppError, PlaylistEntity>>;
}
