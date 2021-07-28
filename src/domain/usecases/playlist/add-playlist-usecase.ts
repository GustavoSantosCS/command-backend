import { PlaylistEntity } from '@/data/entities';
import {
  EstablishmentNotFoundError,
  MusicNotFoundError
} from '@/domain/errors';
import { Either } from '@/shared/either';

export interface AddPlayListUseCase {
  addPlayList(
    newPlayList: AddPlayListUseCase.Params
  ): AddPlayListUseCase.Result;
}

// eslint-disable-next-line no-redeclare
export namespace AddPlayListUseCase {
  export type Params = {
    name: string;
    establishmentId: string;
    userId: string;
    musics: { id: string }[];
  };

  export type Return = Omit<PlaylistEntity, 'establishment' | 'musics'>;

  export type Result = Promise<
    Either<EstablishmentNotFoundError | MusicNotFoundError, Return>
  >;
}
