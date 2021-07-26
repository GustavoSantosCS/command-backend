/* eslint-disable no-restricted-syntax */
import { MusicPlaylistEntity } from '@/data/entities';
import {
  GetMusicByIdRepository,
  GetPlaylistByIdRepository,
  IDGenerator,
  UpdatePlaylistAndMusicsRepository
} from '@/data/protocols';
import { MusicNotFoundError, PlaylistNotFoundError } from '@/domain/errors';
import { UpdateMusicsOfPlaylistUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBUpdateMusicsOfPlaylist implements UpdateMusicsOfPlaylistUseCase {
  private readonly getPlaylistRepo: GetPlaylistByIdRepository;
  private readonly updateMusicsRepo: UpdatePlaylistAndMusicsRepository;
  private readonly getMusicByIdRepo: GetMusicByIdRepository;
  private readonly idGenerator: IDGenerator;

  constructor(
    getPlaylistRepo: GetPlaylistByIdRepository,
    updateMusicsRepo: UpdatePlaylistAndMusicsRepository,
    getMusicByIdRepo: GetMusicByIdRepository,
    idGenerator: IDGenerator
  ) {
    this.getPlaylistRepo = getPlaylistRepo;
    this.updateMusicsRepo = updateMusicsRepo;
    this.idGenerator = idGenerator;
    this.getMusicByIdRepo = getMusicByIdRepo;
  }

  async updateMusicsOfPlaylist({
    musics,
    playlistId,
    userId,
    establishmentId
  }: UpdateMusicsOfPlaylistUseCase.Param): Promise<UpdateMusicsOfPlaylistUseCase.Response> {
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

    const playlistMusics: MusicPlaylistEntity[] = [];
    for await (const music of musics) {
      const trackedMusic = await this.getMusicByIdRepo.getById(music.id);
      if (!trackedMusic || trackedMusic?.establishment.id !== establishmentId)
        return left(new MusicNotFoundError());

      playlistMusics.push(
        new MusicPlaylistEntity(
          this.idGenerator.generate(),
          trackedMusic,
          playlist,
          music.position
        )
      );
    }

    const resultUsecase = await this.updateMusicsRepo.updateMusicsOfPlaylist(
      playlist,
      playlistMusics
    );

    const updatedPlaylist: UpdateMusicsOfPlaylistUseCase.Return = {
      id: resultUsecase.id,
      musicToPlaylist: resultUsecase.musicToPlaylist,
      name: resultUsecase.name,
      isActive: resultUsecase.isActive,
      createdAt: resultUsecase.createdAt,
      updatedAt: resultUsecase.updatedAt
    };

    return right(updatedPlaylist);
  }
}
