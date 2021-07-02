import { GetAllEstablishmentsUserRepository } from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models';
import { GetAlUserEstablishmentsUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBGetAllEstablishmentsUser
  implements GetAlUserEstablishmentsUseCase
{
  constructor(
    private readonly repository: GetAllEstablishmentsUserRepository
  ) {}

  async getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAlUserEstablishmentsUseCase.Response> {
    try {
      const establishments = await this.repository.getAllEstablishmentsUser(
        userId
      );

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
    } catch (error) {
      return left(error);
    }
  }
}
