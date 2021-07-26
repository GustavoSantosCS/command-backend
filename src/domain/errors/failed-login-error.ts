import { AppError } from '@/shared/errors';

export class FailedLoginError extends AppError {
  constructor(value: { email: string; password: string }) {
    super('E-mail/Senha incorreto', value);
    this.name = 'FailedLoginError';
  }
}
