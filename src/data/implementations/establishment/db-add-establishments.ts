import { EstablishmentEntity, EstablishmentImageEntity } from '@/data/entities';
import {
  IDGenerator,
  AddEstablishmentRepository,
  GetUserByIdRepository
} from '@/data/protocols';
import { AddEstablishmentUseCase } from '@/domain/usecases';

export class DBAddEstablishment implements AddEstablishmentUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly getUserRepo: GetUserByIdRepository;
  private readonly saveEstablishmentRepo: AddEstablishmentRepository;

  constructor(
    idGenerator: IDGenerator,
    getUserRepo: GetUserByIdRepository,
    saveEstablishmentRepo: AddEstablishmentRepository
  ) {
    this.idGenerator = idGenerator;
    this.getUserRepo = getUserRepo;
    this.saveEstablishmentRepo = saveEstablishmentRepo;
  }

  async add({
    userId,
    establishment,
    establishmentImage
  }: AddEstablishmentUseCase.Params): Promise<AddEstablishmentUseCase.Response> {
    const userRepo = await this.getUserRepo.getById(userId);

    const newEstablishment = new EstablishmentEntity();
    newEstablishment.id = this.idGenerator.generate();
    newEstablishment.name = establishment.name;
    newEstablishment.description = establishment.description;
    newEstablishment.manager = userRepo;
    newEstablishment.category = establishment.category;
    newEstablishment.isOpen = false;
    const image = new EstablishmentImageEntity();
    Object.assign(image, establishmentImage);
    newEstablishment.image = image;

    const establishmentEntity = await this.saveEstablishmentRepo.save(
      newEstablishment
    );
    delete establishmentEntity.manager;

    return establishmentEntity;
  }
}
