import { IDGenerator, AddEstablishmentRepository } from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models';
import { AddEstablishmentUseCase } from '@/domain/usecases';

export class DBAddEstablishment implements AddEstablishmentUseCase {
  private readonly idGenerator: IDGenerator;
  private readonly addEstablishmentRepository: AddEstablishmentRepository;

  constructor(
    idGenerator: IDGenerator,
    addEstablishmentRepository: AddEstablishmentRepository
  ) {
    this.idGenerator = idGenerator;
    this.addEstablishmentRepository = addEstablishmentRepository;
  }

  async addEstablishment({
    userId,
    establishment,
    establishmentImage
  }: AddEstablishmentUseCase.Params): AddEstablishmentUseCase.Response {
    const establishmentModel: EstablishmentModel = {
      id: this.idGenerator.generate(),
      name: establishment.name,
      category: establishment.category,
      description: establishment.description,
      isOpen: true,
      image: establishmentImage
    };

    const establishmentEntity = await this.addEstablishmentRepository.save(
      userId,
      establishmentModel
    );

    return establishmentEntity;
  }
}
