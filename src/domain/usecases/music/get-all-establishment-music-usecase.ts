import { Either } from '@/shared/either'
import { MusicEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'

export interface GetAllEstablishmentMusicsUseCase {
  getAllEstablishmentMusics: (
    establishmentId: string
  ) => Promise<GetAllEstablishmentMusicsUseCase.Result>
}

// eslint-disable-next-line no-redeclare
export namespace GetAllEstablishmentMusicsUseCase {
  export type Return = Array<Omit<
  MusicEntity,
  'establishment' | 'playlists' | 'surveys' | 'musicToPlaylist'
  >>

  export type Result = Either<EstablishmentNotFoundError, Return>
}
