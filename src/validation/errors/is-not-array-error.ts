import { ValidatorError } from './validator-erros';

export class IsNotArrayError extends ValidatorError {
  constructor(field: string, value: any, customMessage?: string) {
    const message =
      customMessage || `Parâmetro não é um array: ${field} - ${value}`;
    super(message, value, field);
    this.name = 'IsNotArrayError';
  }
}
