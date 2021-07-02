import { PlayListModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface AddPlayListUseCase {
  addPlayList(date: AddPlayListUseCase.Params): AddPlayListUseCase.Result;
}

// eslint-disable-next-line no-redeclare
export namespace AddPlayListUseCase {
  export type Params = {
    name: string;
    establishmentId: string;
    idUser: string;
  };
  export type Result = Promise<Either<AppError, PlayListModel>>;
}
