import { ValidatorError } from './validator-erros'

export class ParamIsNotEmailError extends ValidatorError {
  constructor (message: string, filed: string) {
    super(message, filed)
    this.name = 'ParamIsNotEmailError'
  }
}
