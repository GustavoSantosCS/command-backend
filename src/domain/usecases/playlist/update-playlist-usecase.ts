import { PlaylistEntity } from '@/data/entities'
import { PlaylistNotFoundError } from '@/domain/errors'
import { Either } from '@/shared/either'

export interface UpdatePlaylistUseCase {
  update: (
    data: UpdatePlaylistUseCase.Param
  ) => Promise<UpdatePlaylistUseCase.Response>
}

export namespace UpdatePlaylistUseCase {
  export type Param = {
    userId: string
    name: string
    establishmentId: string
    active: boolean
    id: string
  }

  export type Return = Omit<
    PlaylistEntity,
    'establishment' | 'musics' | 'musicToPlaylist'
  >

  export type Response = Either<PlaylistNotFoundError, Return>
}
