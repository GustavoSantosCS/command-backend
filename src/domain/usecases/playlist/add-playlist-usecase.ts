import { PlaylistEntity } from '@/data/entities';
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
    musics: { id: string; position: number }[];
  };
  export type Result = Promise<Either<AppError, PlaylistEntity>>;
}
