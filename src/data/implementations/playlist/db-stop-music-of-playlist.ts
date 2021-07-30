import {
  GetPlaylistByIdRepository,
  SaveCurrentMusicPlaylistRepository
} from '@/data/protocols';
import {
  PlaylistIsNotActiveError,
  PlaylistNotFoundError
} from '@/domain/errors';
import { StopPlaylistMusicUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBStopMusicOfPlaylist implements StopPlaylistMusicUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository;
  private readonly saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository;

  constructor(
    getPlaylistRepo: GetPlaylistByIdRepository,
    saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository
  ) {
    this.getPlaylistRepo = getPlaylistRepo;
    this.saveCurrentMusicRepo = saveCurrentMusicRepo;
  }

  async stopMusic({
    establishmentId,
    playlistId,
    userId
  }: StopPlaylistMusicUseCase.Param): Promise<StopPlaylistMusicUseCase.Result> {
    const playlist = await this.getPlaylistRepo.getById(playlistId, {
      includeEstablishmentAndManager: true,
      includeCurrentMusic: true
    });

    if (
      !playlist ||
      playlist?.establishment.id !== establishmentId ||
      playlist?.establishment.manager.id !== userId
    ) {
      return left(new PlaylistNotFoundError());
    }

    if (!playlist.isActive) {
      return left(new PlaylistIsNotActiveError());
    }

    playlist.currentMusic.isPlay = false;

    const result = await this.saveCurrentMusicRepo.saveCurrentMusic(
      playlist,
      playlist.currentMusic
    );

    return right(result);
  }
}
