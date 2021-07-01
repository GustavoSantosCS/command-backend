import { IDGenerator, AddEstablishmentRepository } from '@/data/protocols';

import { EstablishmentModel } from '@/domain/models';
import { AddEstablishmentUseCase } from '@/domain/usecases';
import { right } from '@/shared/either';

export class DBAddEstablishment implements AddEstablishmentUseCase {
  constructor(
    private readonly idGenerator: IDGenerator,
    private readonly addEstablishmentRepository: AddEstablishmentRepository
  ) {}

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
      isOpen: true, // TODO: cadastra como false para depois poder alterar para false
      image: establishmentImage
    };

    const establishmentEntity = await this.addEstablishmentRepository.save(
      userId,
      establishmentModel
    );

    delete establishmentEntity.deletedAt;

    return right(establishmentEntity as any);
  }
}
