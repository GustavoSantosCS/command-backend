import { MusicModel } from '@/domain/models';
import { AppError } from '@/shared/app-error';
import { Either } from '@/shared/either';

export interface GetAllEstablishmentMusicsUseCase {
  getAllEstablishmentMusics(
    idUser: string,
    idEstablished: string
  ): Promise<Either<AppError, MusicModel[]>>;
}
