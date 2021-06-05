import { ValidatorError } from './validator-erros';

export class MissingParamError extends ValidatorError {
  constructor(paramName: string, value?: any, customMessage?: string) {
    const message = customMessage || `Parâmetro não informado: ${paramName}`;
    super(message, value);
    this.name = 'MissingParamError';
  }
}
