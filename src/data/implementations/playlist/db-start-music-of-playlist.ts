import {
  GetPlaylistByIdRepository,
  SaveCurrentMusicPlaylistRepository
} from '@/data/protocols'
import {
  PlaylistIsNotActiveError,
  PlaylistNotFoundError
} from '@/domain/errors'
import { StartPlaylistMusicUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBStartMusicOfPlaylist implements StartPlaylistMusicUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository
  private readonly saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository

  constructor(
    getPlaylistRepo: GetPlaylistByIdRepository,
    saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository
  ) {
    this.getPlaylistRepo = getPlaylistRepo
    this.saveCurrentMusicRepo = saveCurrentMusicRepo
  }

  async startMusic({
    establishmentId,
    playlistId,
    userId
  }: StartPlaylistMusicUseCase.Param): Promise<StartPlaylistMusicUseCase.Result> {
    const playlist = await this.getPlaylistRepo.getById(playlistId, {
      withEstablishmentAndManager: true,
      withCurrentMusic: true
    })

    if (
      !playlist ||
      playlist?.establishment.id !== establishmentId ||
      playlist?.establishment.manager.id !== userId
    ) {
      return left(new PlaylistNotFoundError())
    }

    if (!playlist.isActive) {
      return left(new PlaylistIsNotActiveError())
    }

    playlist.currentMusic.isPlay = true

    const result = await this.saveCurrentMusicRepo.saveCurrentMusic(
      playlist,
      playlist.currentMusic
    )

    return right(result)
  }
}
