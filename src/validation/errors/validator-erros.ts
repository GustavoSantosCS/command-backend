import { AppError } from '@/shared/errors'

export class ValidatorError extends AppError {
  constructor (message: string, filed: string) {
    super(message, { filed })
    this.name = 'ValidatorError'
  }
}
