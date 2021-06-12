import { AppError } from '@/shared/app-error';

export class LoginError extends AppError {
  constructor(value: { email: string; password: string }) {
    super('E-mail/Senha incorreto');
    this.value = value;
  }
}
