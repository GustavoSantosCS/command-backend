import {
  GetPlaylistByIdRepository,
  SaveCurrentMusicPlaylistRepository
} from '@/data/protocols'
import {
  PlaylistIsNotActiveError,
  PlaylistNotFoundError
} from '@/domain/errors'
import { PreviousPlaylistMusicUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBPreviousMusicOfPlaylist implements PreviousPlaylistMusicUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository
  private readonly saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository

  constructor(
    getPlaylistRepo: GetPlaylistByIdRepository,
    saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository
  ) {
    this.getPlaylistRepo = getPlaylistRepo
    this.saveCurrentMusicRepo = saveCurrentMusicRepo
  }

  async previousMusic({
    establishmentId,
    playlistId,
    userId
  }: PreviousPlaylistMusicUseCase.Param): Promise<PreviousPlaylistMusicUseCase.Result> {
    const playlist = await this.getPlaylistRepo.getById(playlistId, {
      withEstablishmentAndManager: true,
      withCurrentMusic: true,
      withMusicToPlaylist: true
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

    const { currentMusic, musicToPlaylist } = playlist

    let indexPrevious = (currentMusic?.position ? currentMusic.position : 0) - 1
    if (indexPrevious <= 0) indexPrevious = musicToPlaylist.length

    const previousCurrentMusic = musicToPlaylist.find(
      m => m.position === indexPrevious
    )

    previousCurrentMusic.isPlay = true
    playlist.currentMusic = previousCurrentMusic

    const resultNewCurrent = await this.saveCurrentMusicRepo.saveCurrentMusic(
      playlist,
      previousCurrentMusic
    )

    return right(resultNewCurrent)
  }
}
