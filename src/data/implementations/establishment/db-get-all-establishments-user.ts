import { GetAllEstablishmentsUserRepository } from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models/establishment-model';
import { GetAllEstablishmentsOfUserUseCase } from '@/domain/usecases/establishment';
import { left, right } from '@/shared/either';

export class DBGetAllEstablishmentsUser
  implements GetAllEstablishmentsOfUserUseCase
{
  constructor(
    private readonly repository: GetAllEstablishmentsUserRepository
  ) {}

  async getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAllEstablishmentsOfUserUseCase.Response> {
    try {
      const establishments = await this.repository.getAllEstablishmentsUser(
        userId
      );

      const establishmentsModel = establishments.map(establishment => {
        const establishmentModel = { ...establishment };
        delete establishmentModel.manager;
        return establishmentModel;
      }) as Omit<EstablishmentModel, 'manager'>[];

      return right(establishmentsModel);
    } catch (error) {
      return left(error);
    }
  }
}
