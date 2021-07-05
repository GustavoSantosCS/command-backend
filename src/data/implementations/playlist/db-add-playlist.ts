import {
  GetEstablishedByIdRepository,
  IDGenerator,
  AddPlayListRepository,
  GetMusicByIdRepository
} from '@/data/protocols';

import { PlayListModel } from '@/domain/models';
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

    // eslint-disable-next-line no-restricted-syntax
    for await (const music of musics) {
      const trackedMusic = await this.musicRepo.getById(music.id);
      if (!trackedMusic) {
        return left(
          new AppError('Não foi possível encontrar a musica informada')
        );
      }
    }

    const newPlaylistModel: PlayListModel = {
      id: this.idGenerator.generate(),
      name,
      isActive: true,
      establishment
    };

    const result = await this.playerRepo.add(newPlaylistModel, musics);

    return right(result);
  }
}
