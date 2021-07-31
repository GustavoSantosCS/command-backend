import { AppError } from '@/shared/errors'

export class EstablishmentNotHavePlaylistError extends AppError {
  constructor () {
    super('Estabelecimento não tem uma playlist')
    this.name = 'EstablishmentNotHavePlaylistError'
  }
}
