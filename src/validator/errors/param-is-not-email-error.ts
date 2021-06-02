import { ValidatorError } from './validator-erros';

export class ParamIsNotEmailError extends ValidatorError {
  constructor(email: string, value: string) {
    super(`Parâmetro não é um email: ${email}`, value);
    this.name = 'ParamIsNotEmailError';
  }
}
