import { ValidatorError } from './validator-erros';

export class MaxSizeError extends ValidatorError {
  constructor(paramName: string, maxSize: number, customMessage?: string) {
    const message =
      customMessage ||
      `Parâmetro ${paramName} informado é maior do que ${maxSize}`;
    super(message);
    this.name = 'MaxSizeError';
  }
}
