/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import {
  GetEstablishmentByIdRepository,
  IDGenerator,
  AddPlayListRepository,
  GetMusicByIdRepository
} from '@/data/protocols';
import { AddPlayListUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import {
  EstablishmentNotFoundError,
  MusicNotFoundError
} from '@/domain/errors';
import { EstablishmentEntity } from '@/data/entities';

export class DBAddPlayList implements AddPlayListUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly addPlayListRepo: AddPlayListRepository;
  private readonly getMusicByIdRepo: GetMusicByIdRepository;

  constructor(
    idGenerator: IDGenerator,
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    addPlayListRepo: AddPlayListRepository,
    getMusicByIdRepo: GetMusicByIdRepository
  ) {
    this.idGenerator = idGenerator;
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
    this.getMusicByIdRepo = getMusicByIdRepo;
    this.addPlayListRepo = addPlayListRepo;
  }

  async addPlayList({
    establishmentId,
    userId,
    name,
    musics
  }: AddPlayListUseCase.Params): AddPlayListUseCase.Result {
    const establishment = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );
    if (!establishment) return left(new EstablishmentNotFoundError());

    if (!this.isOwner(establishment as EstablishmentEntity, userId))
      return left(new EstablishmentNotFoundError());

    const playlist = {
      id: this.idGenerator.generate(),
      name,
      isActive: false,
      establishment
    };

    const playlistMusics = [];
    for await (const music of musics) {
      const trackedMusic = await this.getMusicByIdRepo.getById(music.id);
      if (!trackedMusic) return left(new MusicNotFoundError());

      if (!this.isOwner(trackedMusic.establishment, userId))
        return left(new MusicNotFoundError());

      playlistMusics.push({
        id: this.idGenerator.generate(),
        position: music.position,
        music: trackedMusic,
        playlist
      });
    }

    const result = await this.addPlayListRepo.add(
      playlistMusics,
      establishmentId,
      playlist
    );

    result.musics = result.musics.map(music => {
      delete music.establishment;
      delete music.createdAt;
      delete music.updatedAt;
      delete music.deletedAt;
      return music;
    });

    return right(result);
  }

  private isOwner(establishment: EstablishmentEntity, userId: string): boolean {
    const { manager } = establishment;
    return manager.id === userId;
  }
}
