import { ValidatorError } from './validator-erros'

export class MaxSizeError extends ValidatorError {
  constructor (message: string, filed: string) {
    super(message, filed)
    this.name = 'MaxSizeError'
  }
}
