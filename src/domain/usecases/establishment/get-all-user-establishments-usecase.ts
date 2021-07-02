import { EstablishmentModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetAlUserEstablishmentsUseCase {
  getAllEstablishmentsUser(
    userId: string
  ): Promise<GetAlUserEstablishmentsUseCase.Response>;
}

// eslint-disable-next-line no-redeclare
export namespace GetAlUserEstablishmentsUseCase {
  export type Response = Either<
    AppError,
    Omit<EstablishmentModel, 'manager'>[]
  >;
}
