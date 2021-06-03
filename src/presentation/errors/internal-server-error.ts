import { AppError } from '@/shared/app-error';

export class InternalServerError extends AppError {
  constructor(stack?: string) {
    super('Erro No Servidor');
    this.name = 'InternalServerError';
    this.stack = stack;
  }
}
