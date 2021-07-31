import { ValidatorError } from './validator-erros'

export class InvalidParamError extends ValidatorError {
  constructor (message: string, filed: string) {
    super(message, filed)
    this.name = 'InvalidParamError'
  }
}
