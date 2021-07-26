import {
  AddMusicRepository,
  GetEstablishmentByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { EstablishmentNotFoundError } from '@/domain/errors';
import { MusicModel } from '@/domain/models';
import { AddMusicUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBAddMusic implements AddMusicUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly getEstablishmentByIdRepo: GetEstablishmentByIdRepository;
  private readonly addMusicRepo: AddMusicRepository;

  constructor(
    idGenerator: IDGenerator,
    getEstablishmentByIdRepo: GetEstablishmentByIdRepository,
    addMusicRepo: AddMusicRepository
  ) {
    this.idGenerator = idGenerator;
    this.getEstablishmentByIdRepo = getEstablishmentByIdRepo;
    this.addMusicRepo = addMusicRepo;
  }

  async add({
    userId,
    establishmentId,
    name,
    talent,
    duration
  }: AddMusicUseCase.Params): Promise<AddMusicUseCase.Result> {
    const establishment = await this.getEstablishmentByIdRepo.getById(
      establishmentId
    );
    if (!establishment) return left(new EstablishmentNotFoundError());

    const { manager } = establishment;
    if (manager.id !== userId) return left(new EstablishmentNotFoundError());

    const createMusic: MusicModel = {
      id: this.idGenerator.generate(),
      name,
      duration,
      talent
    };

    const result = await this.addMusicRepo.add(createMusic, establishmentId);
    return right(result);
  }
}
