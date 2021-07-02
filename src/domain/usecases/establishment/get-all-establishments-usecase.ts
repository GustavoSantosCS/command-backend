import { EstablishmentModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetAllEstablishmentsUseCase {
  getAllEstablishments(): Promise<GetAllEstablishmentsUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentsUseCase {
  export type Response = Either<
    AppError,
    Omit<EstablishmentModel, 'manager'>[]
  >;
}
