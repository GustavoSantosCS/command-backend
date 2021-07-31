import { AppError } from '@/shared/errors'

export class FailedUpdateAvatarError extends AppError {
  constructor () {
    super('Não foi possível atualizar o avatar')
    this.name = 'FailedUpdateAvatarError'
  }
}
