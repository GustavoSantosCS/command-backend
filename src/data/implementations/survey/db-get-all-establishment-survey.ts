import {
  GetAllEstablishmentSurveyRepository,
  GetEstablishmentByIdRepository
} from '@/data/protocols';
import { EstablishmentNotFoundError } from '@/domain/errors';
import { GetAllEstablishmentSurveyUseCase } from '@/domain/usecases';
import { left, right } from '@/shared/either';

export class DBGetAllEstablishmentSurvey
  implements GetAllEstablishmentSurveyUseCase
{
  private repository: GetAllEstablishmentSurveyRepository;
  private getAllEstablishmentById: GetEstablishmentByIdRepository;

  constructor(
    getAllEstablishmentById: GetEstablishmentByIdRepository,
    repository: GetAllEstablishmentSurveyRepository
  ) {
    this.repository = repository;
    this.getAllEstablishmentById = getAllEstablishmentById;
  }

  async getAll(
    establishmentId: string
  ): Promise<GetAllEstablishmentSurveyUseCase.Response> {
    const establishment = await this.getAllEstablishmentById.getById(
      establishmentId
    );
    if (!establishment) {
      return left(new EstablishmentNotFoundError());
    }

    const surveys = await this.repository.getAllEstablishmentSurvey(
      establishmentId
    );

    return right(surveys);
  }
}
