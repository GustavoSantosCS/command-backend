import { AppError } from '@/shared/app-error';

export class InternalServerError extends AppError {
  constructor() {
    super('Erro No Servidor');
    this.name = 'InternalServerError';
  }
}
