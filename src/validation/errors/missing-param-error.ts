import { ValidatorError } from './validator-erros';

export class MissingParamError extends ValidatorError {
  constructor(paramName: string) {
    super(`Parâmetro não informado: ${paramName}`);
    this.name = 'MissingParamError';
  }
}
