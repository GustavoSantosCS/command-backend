import { GetEstablishmentByIdRepository } from '@/data/protocols';
import { GetAllEstablishmentMusicsRepository } from '@/data/protocols/db/music/get-all-establishment-music-repository';
import { GetAllEstablishmentMusicsUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';
import { EstablishmentNotFoundError } from '@/domain/errors';

export class DBGetAllEstablishmentMusics
  implements GetAllEstablishmentMusicsUseCase
{
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly getAllEstablishmentMusicsRepo: GetAllEstablishmentMusicsRepository;
  constructor(
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    getAllEstablishmentMusicsRepo: GetAllEstablishmentMusicsRepository
  ) {
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
    this.getAllEstablishmentMusicsRepo = getAllEstablishmentMusicsRepo;
  }

  async getAllEstablishmentMusics(
    establishmentId: string
  ): Promise<GetAllEstablishmentMusicsUseCase.Result> {
    const establishment = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );
    if (!establishment) return left(new EstablishmentNotFoundError());

    const musics =
      await this.getAllEstablishmentMusicsRepo.getAllEstablishmentMusics(
        establishmentId
      );
    return right(musics);
  }
}
