import { AppError } from '@/shared/app-error';

export class AddressAlreadyUseError extends AppError {
  constructor(email: string) {
    super('Email já está em uso!', email);
  }
}
