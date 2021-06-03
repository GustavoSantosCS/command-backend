import { ValidatorError } from './validator-erros';

export class InvalidParamError extends ValidatorError {
  constructor(paramName: string, value: any) {
    super(`Parâmetro invalido: ${paramName}`, value);
    this.name = 'InvalidParamError';
  }
}
