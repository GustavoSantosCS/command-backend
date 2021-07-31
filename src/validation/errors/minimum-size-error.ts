import { ValidatorError } from './validator-erros'

export class MinimumSizeError extends ValidatorError {
  constructor (message: string, filed: string) {
    super(message, filed)
    this.name = 'MinimumSizeError'
  }
}
