import { ValidatorError } from './validator-erros';

export class MissingParamError extends ValidatorError {
  constructor(paramName: string, customMessage?: string) {
    const message = customMessage || `Parâmetro não informado: ${paramName}`;
    super(message);
    this.name = 'MissingParamError';
  }
}
