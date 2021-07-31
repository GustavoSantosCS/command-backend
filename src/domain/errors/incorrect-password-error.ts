import { AppError } from '@/shared/errors'

export class IncorrectPasswordError extends AppError {
  constructor (password: string) {
    super('Senha incorreto', { field: 'password', value: password })
    this.name = 'IncorrectPasswordError'
  }
}
