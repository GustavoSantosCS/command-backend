import { ValidatorError } from './validator-erros';

export class NotEqualFieldsError extends ValidatorError {
  constructor(
    paramFieldName: string,
    otherFieldName: string,
    customMessage?: string
  ) {
    const message =
      customMessage ||
      `Valores não são iguais ${paramFieldName} ${otherFieldName}`;
    super(message);
    this.name = 'NotEqualFieldsError';
  }
}
