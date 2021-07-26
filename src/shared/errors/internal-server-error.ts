import { AppError } from '@/shared/errors/app-error';

export class InternalServerError extends AppError {
  data: {};
  private readonly internalMessage: string;
  constructor(internalMessage: string, data?: {}, stack?: string) {
    super(
      'Não foi possível realizar sua operação, tente mais tarde',
      data,
      stack
    );
    this.internalMessage = internalMessage;
  }
}
