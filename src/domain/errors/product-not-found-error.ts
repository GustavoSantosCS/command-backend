import { AppError } from '@/shared/errors';

export class ProductNotFoundError extends AppError {
  constructor() {
    super('Produto informado não encontrado');
    this.name = 'ProductNotFoundError';
  }
}
