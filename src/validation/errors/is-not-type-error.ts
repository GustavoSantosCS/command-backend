import { ValidatorError } from './validator-erros';

export class IsNotTypeError extends ValidatorError {
  constructor(message: string, filed: string) {
    super(message, filed);
    this.name = 'IsNotTypeError';
  }
}
