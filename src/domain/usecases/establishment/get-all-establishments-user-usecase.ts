import { EstablishmentModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetAllEstablishmentsOfUserUseCase {
  getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAllEstablishmentsOfUserUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentsOfUserUseCase {
  export type Response = Either<
    AppError,
    Omit<EstablishmentModel, 'manager'>[]
  >;
}
