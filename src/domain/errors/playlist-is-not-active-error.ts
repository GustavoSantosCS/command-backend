import { AppError } from '@/shared/errors'

export class PlaylistIsNotActiveError extends AppError {
  constructor () {
    super('Playlist não esta ativo')
    this.name = 'PlaylistIsNotActiveError'
  }
}
