import { ValidatorError } from './validator-erros';

export class IsNotEmailError extends ValidatorError {
  constructor(message: string, filed: string) {
    super(message, filed);
    this.name = 'IsNotEmailError';
  }
}
