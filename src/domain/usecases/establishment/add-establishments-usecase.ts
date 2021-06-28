import {
  CATEGORY,
  EstablishmentImageModel,
  EstablishmentModel
} from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface AddEstablishmentUseCase {
  addEstablishment(
    data: AddEstablishmentUseCase.Params
  ): AddEstablishmentUseCase.Response;
}

// eslint-disable-next-line no-redeclare
export namespace AddEstablishmentUseCase {
  export type Params = {
    userId: string;
    establishment: {
      name: string;
      category: CATEGORY;
      description: string;
    };
    establishmentImage: EstablishmentImageModel;
  };

  export type Response = Promise<
    Either<AppError, Omit<EstablishmentModel, 'manager'>>
  >;
}
