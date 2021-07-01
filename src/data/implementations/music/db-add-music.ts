import {
  AddMusicRepository,
  GetEstablishedByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { MusicModel } from '@/domain/models';
import { AddMusicUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBAddMusic implements AddMusicUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly establishedRepo: GetEstablishedByIdRepository,
    private readonly musicRepo: AddMusicRepository
  ) {}
  async save({
    idUser,
    establishmentId,
    name,
    talent,
    duration
  }: AddMusicUseCase.Params): Promise<Either<AppError, MusicModel>> {
    const trackedEstablishment = await this.establishedRepo.getById(
      establishmentId
    );

    if (trackedEstablishment?.manager.id !== idUser)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const createMusic: MusicModel = {
      id: this.idGenerator.generate(),
      name,
      duration,
      talent
    };

    const repoResultAdd = await this.musicRepo.add(
      createMusic,
      establishmentId
    );

    const persistentMusic: MusicModel = {
      id: repoResultAdd.id,
      name: repoResultAdd.name,
      duration: repoResultAdd.duration,
      talent: repoResultAdd.talent,
      createdAt: repoResultAdd.createdAt,
      updatedAt: repoResultAdd.updatedAt
    };

    return right(persistentMusic);
  }
}
