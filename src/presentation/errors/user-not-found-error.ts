import { AppError } from '@/shared/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('Usuário Não encontrado');
    this.name = 'UserNotFoundError';
  }
}
