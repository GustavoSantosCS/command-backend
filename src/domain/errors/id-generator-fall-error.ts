import { AppError } from '@/shared/app-error';

export class IDGeneratorFallError extends AppError {
  constructor() {
    super('Não foi possível gerar o ID');
  }
}
