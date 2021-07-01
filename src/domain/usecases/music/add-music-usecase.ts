import { MusicModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface AddMusicUseCase {
  save(data: AddMusicUseCase.Params): Promise<Either<AppError, MusicModel>>;
}

// eslint-disable-next-line no-redeclare
export namespace AddMusicUseCase {
  export type Params = {
    idUser: string;
    establishmentId: string;
    name: string;
    talent: string;
    duration: number;
  };
}
