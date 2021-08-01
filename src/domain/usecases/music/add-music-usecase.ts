import { Either } from '@/shared/either'
import { MusicEntity } from '@/data/entities'
import { EstablishmentNotFoundError } from '@/domain/errors'
import { ImagePersistenceData } from '@/domain/models'

export interface AddMusicUseCase {
  add: (data: AddMusicUseCase.Params) => Promise<AddMusicUseCase.Result>
}

export namespace AddMusicUseCase {
  export type Params = {
    userId: string
    establishmentId: string
    name: string
    talent: string
    duration: number
    musicImage: ImagePersistenceData
  }

  export type Return = Omit<
    MusicEntity,
    'establishment' | 'playlists' | 'surveys' | 'musicToPlaylist'
  >

  export type Result = Either<EstablishmentNotFoundError, Return>
}
