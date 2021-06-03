import { AppError } from '@/shared/app-error';

export class EmailAlreadyUseError extends AppError {
  constructor(email: string) {
    super('Email já está em uso!', email);
  }
}
