import { AppError } from '@/shared/errors'

export class MusicNotFoundError extends AppError {
  constructor () {
    super('Musica não encontrado')
    this.name = 'MusicNotFoundError'
  }
}
