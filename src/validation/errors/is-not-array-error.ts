import { ValidatorError } from './validator-erros';

export class IsNotArrayError extends ValidatorError {
  constructor(message: string, filed: string) {
    super(message, filed);
    this.name = 'IsNotArrayError';
  }
}
