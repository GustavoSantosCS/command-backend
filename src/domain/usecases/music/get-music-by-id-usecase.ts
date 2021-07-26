import { MusicEntity } from '@/data/entities';
import { MusicNotFoundError } from '@/domain/errors';
import { Either } from '@/shared/either';

export interface GetMusicByIdUseCase {
  getMusicById(
    musicId: string
  ): Promise<Either<MusicNotFoundError, MusicEntity>>;
}
