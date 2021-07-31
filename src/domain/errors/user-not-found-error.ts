import { AppError } from '@/shared/errors'

export class UserNotFoundError extends AppError {
  constructor () {
    super('Usuário Não encontrado')
    this.name = 'UserNotFoundError'
  }
}
