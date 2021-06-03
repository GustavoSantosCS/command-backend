import { ValidatorError } from './validator-erros';

export class IsNotEmailError extends ValidatorError {
  constructor(paramName: string, value: any) {
    super(`Parâmetro não é um email: ${paramName} - ${value}`, value);
    this.name = 'IsNotEmailError';
  }
}
