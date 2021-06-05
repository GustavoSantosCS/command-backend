import { ValidatorError } from './validator-erros';

export class InvalidParamError extends ValidatorError {
  constructor(paramName: string, value: any, customMessage?: string) {
    const message = customMessage || `Parâmetro invalido: ${paramName}`;
    super(message, value);
    this.name = 'InvalidParamError';
  }
}
