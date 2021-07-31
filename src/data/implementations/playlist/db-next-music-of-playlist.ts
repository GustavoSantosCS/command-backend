import {
  GetPlaylistByIdRepository,
  SaveCurrentMusicPlaylistRepository
} from '@/data/protocols'
import {
  PlaylistIsNotActiveError,
  PlaylistNotFoundError
} from '@/domain/errors'
import { NextPlaylistMusicUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBNextMusicOfPlaylist implements NextPlaylistMusicUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository
  private readonly saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository

  constructor (
    getPlaylistRepo: GetPlaylistByIdRepository,
    saveCurrentMusicRepo: SaveCurrentMusicPlaylistRepository
  ) {
    this.getPlaylistRepo = getPlaylistRepo
    this.saveCurrentMusicRepo = saveCurrentMusicRepo
  }

  async nextMusic ({
    establishmentId,
    playlistId,
    userId
  }: NextPlaylistMusicUseCase.Param): Promise<NextPlaylistMusicUseCase.Result> {
    const playlist = await this.getPlaylistRepo.getById(playlistId, {
      includeEstablishmentAndManager: true,
      includeCurrentMusic: true,
      includeMusicToPlaylist: true
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

    let indexNext = (currentMusic?.position ? currentMusic.position : 0) + 1
    if (musicToPlaylist.length < indexNext) indexNext = 1
    const nextCurrentMusic = musicToPlaylist.find(
      m => m.position === indexNext
    )

    nextCurrentMusic.isPlay = true
    playlist.currentMusic = nextCurrentMusic

    const resultNewCurrent = await this.saveCurrentMusicRepo.saveCurrentMusic(
      playlist,
      nextCurrentMusic
    )

    return right(resultNewCurrent)
  }
}
