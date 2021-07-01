import { GetEstablishedByIdRepository } from '@/data/protocols';
import { GetAllEstablishmentMusicsRepository } from '@/data/protocols/db/music/get-all-establishment-music-repository';
import { MusicModel } from '@/domain/models';
import { GetAllEstablishmentMusicsUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

type MusicsReturn = Omit<MusicModel, 'establishment'>;

export class DBGetAllEstablishmentMusics
  implements GetAllEstablishmentMusicsUseCase
{
  constructor(
    private readonly establishedRepo: GetEstablishedByIdRepository,
    private readonly musicRepo: GetAllEstablishmentMusicsRepository
  ) {}
  async getAllEstablishmentMusics(
    idUser: string,
    establishmentId: string
  ): Promise<Either<AppError, MusicsReturn[]>> {
    const trackedEstablishment = await this.establishedRepo.getById(
      establishmentId
    );

    if (trackedEstablishment?.manager.id !== idUser)
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    const musicsEntity = await this.musicRepo.getAllEstablishmentMusics(
      establishmentId
    );

    const musics: MusicsReturn[] = musicsEntity.map(music => {
      // eslint-disable-next-line no-param-reassign
      delete music.establishment;
      // eslint-disable-next-line no-param-reassign
      delete music.deletedAt;
      return music as MusicsReturn;
    });

    return right(musics);
  }
}
