import { GetAllEstablishmentsRepository } from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models';
import { GetAllEstablishmentsUseCase } from '@/domain/usecases';
import { right } from '@/shared/either';

export class DBGetAllEstablishments implements GetAllEstablishmentsUseCase {
  constructor(private readonly repository: GetAllEstablishmentsRepository) {}

  async getAllEstablishments(): Promise<GetAllEstablishmentsUseCase.Response> {
    const establishments = await this.repository.getAllEstablishments();

    const establishmentsModel: Omit<EstablishmentModel, 'manager'>[] =
      establishments.map(establishment => ({
        id: establishment.id,
        name: establishment.name,
        description: establishment.description,
        category: establishment.category,
        isOpen: establishment.isOpen,
        createdAt: establishment.createdAt,
        updatedAt: establishment.updatedAt,
        image: establishment.image
      }));

    return right(establishmentsModel);
  }
}
