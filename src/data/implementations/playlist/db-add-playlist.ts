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
import {
  EstablishmentEntity,
  MusicPlaylistEntity,
  PlaylistEntity
} from '@/data/entities';

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

    if (!establishment || establishment?.manager.id !== userId)
      return left(new EstablishmentNotFoundError());

    const playlist = new PlaylistEntity();
    playlist.id = this.idGenerator.generate();
    playlist.name = name;
    playlist.isActive = false;
    playlist.establishment = establishment as EstablishmentEntity;

    const musicsTrack = await Promise.all(
      musics.map(async musicId => {
        const trackedMusic = await this.getMusicByIdRepo.getById(musicId);
        if (!trackedMusic || trackedMusic?.establishment.id !== establishmentId)
          return null;

        return trackedMusic;
      })
    );

    if (musicsTrack.some(m => !m)) {
      return left(new MusicNotFoundError());
    }

    const playlistMusics: MusicPlaylistEntity[] = musicsTrack.map(
      (music, position) =>
        new MusicPlaylistEntity(
          this.idGenerator.generate(),
          music,
          playlist,
          position + 1
        )
    );

    const result = await this.addPlayListRepo.add(playlist, playlistMusics);

    return right(result);
  }
}
