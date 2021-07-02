import {
  GetEstablishedByIdRepository,
  IDGenerator,
  AddPlayListRepository
} from '@/data/protocols';

import { PlayListModel } from '@/domain/models';
import { AddPlayListUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { left, right } from '@/shared/either';

export class DBAddPlayList implements AddPlayListUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly establishedRepo: GetEstablishedByIdRepository,
    private readonly playerRepo: AddPlayListRepository
  ) {}

  async addPlayList({
    establishmentId,
    idUser,
    name
  }: AddPlayListUseCase.Params): AddPlayListUseCase.Result {
    const establishment = await this.establishedRepo.getById(establishmentId);

    if (establishment?.manager.id !== idUser)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const newPlaylistModel: PlayListModel = {
      id: this.idGenerator.generate(),
      name,
      isActive: true,
      establishment
    };

    const result = await this.playerRepo.add(newPlaylistModel);

    return right(result as any);
  }
}
