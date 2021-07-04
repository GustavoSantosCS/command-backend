import { PlaylistEntity } from '@/data/entities';
import {
  GetCurrentEstablishedPlaylistRepository,
  GetEstablishedByIdRepository
} from '@/data/protocols';
import { GetCurrentEstablishedPlaylistUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBGetCurrentEstablishedPlaylist
  implements GetCurrentEstablishedPlaylistUseCase
{
  constructor(
    private readonly establishmentRepo: GetEstablishedByIdRepository,
    private readonly playlistRepo: GetCurrentEstablishedPlaylistRepository
  ) {}

  async getCurrentPlaylist(
    userId: string,
    establishmentId: string
  ): Promise<Either<AppError, PlaylistEntity>> {
    const establishment = await this.establishmentRepo.getById(establishmentId);
    if (establishment?.manager.id !== userId)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const currentPlaylist = await this.playlistRepo.getEstablishedPlaylist(
      establishmentId
    );

    return right(currentPlaylist);
  }
}
