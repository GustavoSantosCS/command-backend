import { MusicEntity } from '@/data/entities';
import {
  AddMusicRepository,
  GetEstablishmentByIdRepository,
  IDGenerator
} from '@/data/protocols';
import { EstablishmentNotFoundError } from '@/domain/errors';
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
    const establishmentRepo = await this.getEstablishmentByIdRepo.getById(
      establishmentId,
      { withManager: true }
    );
    if (establishmentRepo?.manager.id !== userId)
      return left(new EstablishmentNotFoundError());

    const newMusic = new MusicEntity();
    newMusic.id = this.idGenerator.generate();
    newMusic.name = name;
    newMusic.talent = talent;
    newMusic.duration = duration;
    newMusic.establishment = establishmentRepo;

    const result = await this.addMusicRepo.save(newMusic);
    return right(result);
  }
}
