import { GetEstablishedByIdRepository } from '@/data/protocols';
import { EstablishmentModel } from '@/domain/models';
import { GetUserEstablishedByIdUseCase } from '@/domain/usecases';
import { AppError } from '@/shared/app-error';
import { Either, left, right } from '@/shared/either';

export class DBGetUserEstablishmentById
  implements GetUserEstablishedByIdUseCase
{
  constructor(private readonly repository: GetEstablishedByIdRepository) {}

  async getUserEstablishedById(
    idUser: string,
    idEstablished: string
  ): Promise<Either<AppError, EstablishmentModel>> {
    const establishmentEntity = await this.repository.getById(idEstablished);

    if (
      !establishmentEntity ||
      (establishmentEntity && establishmentEntity.manager.id !== idUser)
    )
      return left(new AppError('Não foi possível encontrar o estabelecimento'));

    delete establishmentEntity.manager;

    return right(establishmentEntity as EstablishmentModel);
  }
}
