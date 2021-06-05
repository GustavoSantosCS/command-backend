import { ValidatorError } from './validator-erros';

export class MinimumSizeError extends ValidatorError {
  constructor(paramName: string, minimumSize: number, customMessage?: string) {
    const message =
      customMessage ||
      `Parâmetro ${paramName} informado é menor do que ${minimumSize}`;
    super(message);
    this.name = 'MinimumSizeError';
  }
}
