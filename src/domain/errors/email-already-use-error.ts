import { AppError } from '@/shared/errors';

export class EmailAlreadyUseError extends AppError {
  constructor(email: string) {
    super('Email já está em uso!', { field: email });
    this.name = 'EmailAlreadyUseError';
  }
}
