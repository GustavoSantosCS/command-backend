import { AppError } from '@/shared/errors'

export class EstablishmentNotFoundError extends AppError {
  constructor () {
    super('Estabelecimento não encontrado')
    this.name = 'EstablishmentNotFoundError'
  }
}
