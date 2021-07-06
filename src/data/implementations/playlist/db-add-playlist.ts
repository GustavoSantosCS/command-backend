import {
  GetEstablishedByIdRepository,
  IDGenerator,
  AddPlayListRepository,
  GetMusicByIdRepository
} from '@/data/protocols';
import { AddPlayListUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { left, right } from '@/shared/either';

export class DBAddPlayList implements AddPlayListUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly establishmentRepo: GetEstablishedByIdRepository,
    private readonly playerRepo: AddPlayListRepository,
    private readonly musicRepo: GetMusicByIdRepository
  ) {}

  async addPlayList({
    establishmentId,
    idUser,
    name,
    musics
  }: AddPlayListUseCase.Params): AddPlayListUseCase.Result {
    const establishment = await this.establishmentRepo.getById(establishmentId);

    if (establishment?.manager.id !== idUser)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const playlist = {
      id: this.idGenerator.generate(),
      name,
      isActive: true,
      establishment
    };

    const playlistMusics = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const music of musics) {
      const trackedMusic = await this.musicRepo.getById(music.id);
      if (!trackedMusic)
        return left(
          new AppError('Não foi possível encontrar a musica informada')
        );

      playlistMusics.push({
        id: this.idGenerator.generate(),
        position: music.position,
        music: trackedMusic,
        playlist
      });
    }

    const result = await this.playerRepo.add(
      playlistMusics,
      establishmentId,
      playlist
    );

    return right(result);
  }
}
