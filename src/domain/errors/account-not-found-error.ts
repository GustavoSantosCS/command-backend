import { AppError } from '@/shared/errors';

export class AccountNotFoundError extends AppError {
  constructor() {
    super('Conta informada não encontrada');
    this.name = 'AccountNotFoundError';
  }
}
