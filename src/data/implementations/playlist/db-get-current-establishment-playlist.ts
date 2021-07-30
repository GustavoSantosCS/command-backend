import {
  GetCurrentEstablishmentPlaylistRepository,
  GetEstablishmentByIdRepository
} from '@/data/protocols';
import { GetCurrentEstablishmentPlaylistUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import {
  EstablishmentNotFoundError,
  EstablishmentNotHavePlaylistError
} from '@/domain/errors';

export class DBGetCurrentEstablishmentPlaylist
  implements GetCurrentEstablishmentPlaylistUseCase
{
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly getCurrentEstablishmentPlaylistRepo: GetCurrentEstablishmentPlaylistRepository;

  constructor(
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    getCurrentEstablishmentPlaylistRepo: GetCurrentEstablishmentPlaylistRepository
  ) {
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
    this.getCurrentEstablishmentPlaylistRepo =
      getCurrentEstablishmentPlaylistRepo;
  }

  async getCurrentPlaylist(
    userId: string,
    establishmentId: string
  ): Promise<GetCurrentEstablishmentPlaylistUseCase.Response> {
    const establishmentRepo = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );

    if (!establishmentRepo) return left(new EstablishmentNotFoundError());

    const currentPlaylist =
      await this.getCurrentEstablishmentPlaylistRepo.getEstablishmentPlaylist(
        establishmentId
      );

    if (!currentPlaylist) return left(new EstablishmentNotHavePlaylistError());

    const result: GetCurrentEstablishmentPlaylistUseCase.Result = {
      id: currentPlaylist.id,
      name: currentPlaylist.name,
      musicToPlaylist: currentPlaylist.musicToPlaylist,
      currentMusic: currentPlaylist.currentMusic,
      isActive: currentPlaylist.isActive,
      createdAt: currentPlaylist.createdAt,
      updatedAt: currentPlaylist.updatedAt
    };

    return right(result);
  }
}
