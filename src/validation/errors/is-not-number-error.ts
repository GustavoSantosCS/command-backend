import { ValidatorError } from './validator-erros';

export class IsNotNumberError extends ValidatorError {
  constructor(paramName: string, value: any, customMessage?: string) {
    const message =
      customMessage || `Parâmetro não é um numero: ${paramName} - ${value}`;
    super(message, value);
    this.name = 'IsNotNumberError';
  }
}
