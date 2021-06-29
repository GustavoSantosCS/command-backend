import { EstablishmentModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetUserEstablishedByIdUseCase {
  getUserEstablishedById(
    idUser: string,
    idEstablished: string
  ): Promise<Either<AppError, EstablishmentModel>>;
}
