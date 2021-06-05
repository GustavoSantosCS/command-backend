import { AppError } from '@/shared/app-error';

export class PersistencyError extends AppError {
  constructor(message: string, value: any, stack: string) {
    super(message);
    this.value = value;
    this.stack = stack;
    this.name = 'PersistencyError';
  }
}
