import { MusicPlaylistEntity } from '@/data/entities'
import {
  GetMusicByIdRepository,
  GetPlaylistByIdRepository,
  IDGenerator,
  UpdatePlaylistAndMusicsRepository
} from '@/data/protocols'
import { MusicNotFoundError, PlaylistNotFoundError } from '@/domain/errors'
import { UpdateMusicsOfPlaylistUseCase } from '@/domain/usecases'
import { left, right } from '@/shared/either'

export class DBUpdateMusicsOfPlaylist implements UpdateMusicsOfPlaylistUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository
  private readonly updateMusicsRepo: UpdatePlaylistAndMusicsRepository
  private readonly getMusicByIdRepo: GetMusicByIdRepository
  private readonly idGenerator: IDGenerator

  constructor (
    getPlaylistRepo: GetPlaylistByIdRepository,
    updateMusicsRepo: UpdatePlaylistAndMusicsRepository,
    getMusicByIdRepo: GetMusicByIdRepository,
    idGenerator: IDGenerator
  ) {
    this.getPlaylistRepo = getPlaylistRepo
    this.updateMusicsRepo = updateMusicsRepo
    this.idGenerator = idGenerator
    this.getMusicByIdRepo = getMusicByIdRepo
  }

  async updateMusicsOfPlaylist ({
    musics,
    playlistId,
    userId,
    establishmentId
  }: UpdateMusicsOfPlaylistUseCase.Param): Promise<UpdateMusicsOfPlaylistUseCase.Response> {
    const playlist = await this.getPlaylistRepo.getById(playlistId, {
      includeEstablishmentAndManager: true
    })

    if (
      !playlist ||
      playlist?.establishment.id !== establishmentId ||
      playlist?.establishment.manager.id !== userId
    ) {
      return left(new PlaylistNotFoundError())
    }

    const musicsTrack = await Promise.all(
      musics.map(async musicId => {
        const trackedMusic = await this.getMusicByIdRepo.getById(musicId)
        if (!trackedMusic || trackedMusic?.establishment.id !== establishmentId) { return null }

        return trackedMusic
      })
    )

    if (musicsTrack.some(m => !m)) {
      return left(new MusicNotFoundError())
    }

    const playlistMusics: MusicPlaylistEntity[] = musicsTrack.map(
      (music, position) =>
        new MusicPlaylistEntity(
          this.idGenerator.generate(),
          music,
          playlist,
          position + 1
        )
    )

    const resultUsecase = await this.updateMusicsRepo.updateMusics(
      playlist,
      playlistMusics
    )

    const updatedPlaylist: UpdateMusicsOfPlaylistUseCase.Return = {
      id: resultUsecase.id,
      musicToPlaylist: resultUsecase.musicToPlaylist,
      name: resultUsecase.name,
      currentMusic: resultUsecase.currentMusic,
      isActive: resultUsecase.isActive,
      createdAt: resultUsecase.createdAt,
      updatedAt: resultUsecase.updatedAt
    }

    return right(updatedPlaylist)
  }
}
