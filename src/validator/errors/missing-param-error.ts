import { ValidatorError } from './validator-erros';

export class MissingParamError extends ValidatorError {
  constructor(paramName: string, value: string) {
    super(`Parâmetro não informado: ${paramName}`, value);
    this.name = 'MissingParamError';
  }
}
