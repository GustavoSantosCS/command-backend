import { ValidatorError } from './validator-erros';

export class NotEqualFieldsError extends ValidatorError {
  constructor(paramFieldName: string, otherFieldName: string) {
    super(`Valores não são iguais ${paramFieldName} ${otherFieldName}`);
    this.name = 'NotEqualFieldsError';
  }
}
