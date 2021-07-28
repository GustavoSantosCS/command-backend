/* eslint-disable no-restricted-syntax */
import {
  ClosesAllEstablishmentPlaylistsRepository,
  GetPlaylistByIdRepository,
  UpdatePlaylistRepository
} from '@/data/protocols';
import { PlaylistNotFoundError } from '@/domain/errors';
import { UpdatePlaylistUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBUpdatePlaylist implements UpdatePlaylistUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository;
  private readonly updatePlaylistRepo: UpdatePlaylistRepository;
  private readonly closesAllPlaylist: ClosesAllEstablishmentPlaylistsRepository;

  constructor(
    getPlaylistRepo: GetPlaylistByIdRepository,
    closesAllPlaylist: ClosesAllEstablishmentPlaylistsRepository,
    updatePlaylistRepo: UpdatePlaylistRepository
  ) {
    this.getPlaylistRepo = getPlaylistRepo;
    this.closesAllPlaylist = closesAllPlaylist;
    this.updatePlaylistRepo = updatePlaylistRepo;
  }

  async updatePlaylist({
    name,
    id: playlistId,
    userId,
    active,
    establishmentId
  }: UpdatePlaylistUseCase.Param): Promise<UpdatePlaylistUseCase.Response> {
    const playlist = await this.getPlaylistRepo.getPlaylistById(playlistId, {
      includeEstablishmentAndManager: true
    });

    if (
      !playlist ||
      playlist?.establishment.id !== establishmentId ||
      playlist?.establishment.manager.id !== userId
    ) {
      return left(new PlaylistNotFoundError());
    }

    if (active === true) {
      await this.closesAllPlaylist.closesAllEstablishmentPlaylist(
        playlist.establishment.id
      );
    }

    playlist.name = name;
    playlist.isActive = active;
    const resultUseCase = await this.updatePlaylistRepo.updatePlaylist(
      playlist
    );

    const result: UpdatePlaylistUseCase.Return = {
      id: resultUseCase.id,
      name: resultUseCase.name,
      isActive: resultUseCase.isActive,
      currentMusic: resultUseCase.currentMusic,
      createdAt: resultUseCase.createdAt,
      updatedAt: resultUseCase.updatedAt
    };

    return right(result);
  }
}
