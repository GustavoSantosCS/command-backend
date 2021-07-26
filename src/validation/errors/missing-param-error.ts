import { ValidatorError } from './validator-erros';

export class MissingParamError extends ValidatorError {
  constructor(message: string, filed: string) {
    super(message, filed);
    this.name = 'MissingParamError';
  }
}
