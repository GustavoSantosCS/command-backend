import { ValidatorError } from './validator-erros';

export class NotEqualFieldsError extends ValidatorError {
  constructor(message: string, filed: string) {
    super(message, filed);
    this.name = 'NotEqualFieldsError';
  }
}
